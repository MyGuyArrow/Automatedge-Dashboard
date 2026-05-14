import 'server-only';

type AirtableRecord<TFields extends Record<string, unknown>> = {
  id: string;
  createdTime?: string;
  fields: TFields;
};

type ListOptions = {
  filterByFormula?: string;
  sort?: { field: string; direction?: 'asc' | 'desc' }[];
  maxRecords?: number;
  pageSize?: number;
};

const baseUrl = 'https://api.airtable.com/v0';

const getConfig = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID.');
  }

  return { apiKey, baseId };
};

const tableUrl = (tableName: string) => {
  const { baseId } = getConfig();
  return `${baseUrl}/${baseId}/${encodeURIComponent(tableName)}`;
};

const airtableFetch = async <T>(url: string, init: RequestInit = {}, attempt = 0): Promise<T> => {
  const { apiKey } = getConfig();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    return airtableFetch<T>(url, init, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable request failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
};

export const escapeFormulaString = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
export const fieldEq = (field: string, value: string | number | boolean) =>
  typeof value === 'number'
    ? `{${field}} = ${value}`
    : typeof value === 'boolean'
      ? `{${field}} = ${value ? 'TRUE()' : 'FALSE()'}`
      : `{${field}} = '${escapeFormulaString(value)}'`;
export const andFormula = (...parts: string[]) => `AND(${parts.filter(Boolean).join(', ')})`;
export const orFormula = (...parts: string[]) => `OR(${parts.filter(Boolean).join(', ')})`;
export const notFormula = (part: string) => `NOT(${part})`;

export const listRecords = async <TFields extends Record<string, unknown>>(
  tableName: string,
  options: ListOptions = {},
) => {
  const records: AirtableRecord<TFields>[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(tableUrl(tableName));
    if (options.filterByFormula) url.searchParams.set('filterByFormula', options.filterByFormula);
    if (options.maxRecords) url.searchParams.set('maxRecords', String(options.maxRecords));
    if (options.pageSize) url.searchParams.set('pageSize', String(options.pageSize));
    if (offset) url.searchParams.set('offset', offset);
    options.sort?.forEach((sort, index) => {
      url.searchParams.set(`sort[${index}][field]`, sort.field);
      url.searchParams.set(`sort[${index}][direction]`, sort.direction || 'asc');
    });

    const page = await airtableFetch<{ records: AirtableRecord<TFields>[]; offset?: string }>(
      url.toString(),
    );
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  return records;
};

export const getRecord = async <TFields extends Record<string, unknown>>(tableName: string, id: string) =>
  airtableFetch<AirtableRecord<TFields>>(`${tableUrl(tableName)}/${id}`);

export const createRecord = async <TFields extends Record<string, unknown>>(
  tableName: string,
  fields: TFields,
) =>
  airtableFetch<AirtableRecord<TFields>>(tableUrl(tableName), {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });

export const updateRecord = async <TFields extends Record<string, unknown>>(
  tableName: string,
  id: string,
  fields: Partial<TFields>,
) =>
  airtableFetch<AirtableRecord<TFields>>(`${tableUrl(tableName)}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });

export type { AirtableRecord };
