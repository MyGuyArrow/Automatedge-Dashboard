import Link from 'next/link';

import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Client } from '@/types';

export function OperatorClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Client Workspaces</h2>
        <p className="mt-1 text-sm text-slate-600">
          Search and filtering can be extended without changing the Airtable schema.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Package
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned Operator
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-950">{client.businessName}</p>
                  <p className="mt-1 text-sm text-slate-500">{client.primaryContactEmail}</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{client.packageType}</td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {client.assignedOperatorUserId || 'Unassigned'}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/operator/clients/${client.id}`}
                    className="text-sm font-semibold text-teal-700"
                  >
                    Open workspace
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
