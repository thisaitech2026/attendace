"use client";

import { useEffect, useState } from "react";
import { Zap, Droplets } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/native/PageHeader";
import { InfoRow } from "@/components/native/InfoRow";
import { LoadingState } from "@/components/native/States";

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

  if (loading) return <LoadingState />;
  if (!data?.rental) return <div className="text-gray-500 text-center py-10">No rental assigned</div>;

  const utility = data.rental.property.utility;

  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="Utilities" subtitle={data.rental.property.name} />

      <Card title="Electricity (EB)">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
            <Zap className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1 space-y-2">
            <InfoRow label="Service Number" value={utility?.ebServiceNumber || "Not available"} />
            <InfoRow label="Consumer Name" value={utility?.ebConsumerName || "Not available"} />
          </div>
        </div>
      </Card>

      <Card title="Water Connection">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <InfoRow label="Connection Number" value={utility?.waterConnectionNumber || "Not available"} />
            <InfoRow label="Consumer Name" value={utility?.waterConsumerName || "Not available"} />
          </div>
        </div>
      </Card>
    </div>
  );
}
