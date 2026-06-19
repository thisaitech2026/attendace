"use client";

import { useEffect, useState } from "react";
import { Zap, Droplets } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface UtilityData {
  rental: {
    property: {
      name: string;
      utility?: {
        ebServiceNumber: string | null;
        ebConsumerName: string | null;
        waterConnectionNumber: string | null;
        waterConsumerName: string | null;
      };
    };
  } | null;
}

export default function UtilitiesPage() {
  const [data, setData] = useState<UtilityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!data?.rental) return <div className="text-gray-500">No rental assigned</div>;

  const utility = data.rental.property.utility;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Utility Information</h1>
        <p className="text-gray-500">EB and Water connection details for {data.rental.property.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Electricity (EB)">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-yellow-50 p-3">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <dl className="space-y-3 flex-1">
              <div>
                <dt className="text-sm text-gray-500">EB Service Number</dt>
                <dd className="text-lg font-mono font-medium">{utility?.ebServiceNumber || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Consumer Name</dt>
                <dd className="text-lg font-medium">{utility?.ebConsumerName || "Not available"}</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card title="Water Connection">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
            <dl className="space-y-3 flex-1">
              <div>
                <dt className="text-sm text-gray-500">Water Connection Number</dt>
                <dd className="text-lg font-mono font-medium">{utility?.waterConnectionNumber || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Consumer Name</dt>
                <dd className="text-lg font-medium">{utility?.waterConsumerName || "Not available"}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </div>
  );
}
