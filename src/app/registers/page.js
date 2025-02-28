"use client";

import { useRouter } from "next/navigation";
import { Card } from "antd";
import { Package, DollarSign, AlertTriangle } from "lucide-react";

export default function Registers() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-3 gap-8">
        {/* IN Register Card */}
        <Card
          className="w-40 h-40 flex flex-col justify-center items-center bg-blue-500 text-white cursor-pointer hover:shadow-xl transition relative"
          onClick={() => router.push("/registers/tables")}
        >
          <Package size={36} className="mb-2" />
          <span className="opacity-0 hover:opacity-100 transition-opacity absolute bottom-2 text-sm">
            IN Register
          </span>
        </Card>

        {/* Accounts Card */}
        <Card
          className="w-40 h-40 flex flex-col justify-center items-center bg-blue-500 text-white cursor-pointer hover:shadow-xl transition relative"
          onClick={() => router.push("/accounts")}
        >
          <DollarSign size={36} className="mb-2" />
          <span className="opacity-0 hover:opacity-100 transition-opacity absolute bottom-2 text-sm">
            Accounts
          </span>
        </Card>

        {/* Complaints Card */}
        <Card
          className="w-40 h-40 flex flex-col justify-center items-center bg-blue-500 text-white cursor-pointer hover:shadow-xl transition relative"
          onClick={() => router.push("/complaints")}
        >
          <AlertTriangle size={36} className="mb-2" />
          <span className="opacity-0 hover:opacity-100 transition-opacity absolute bottom-2 text-sm">
            Complaints
          </span>
        </Card>
      </div>
    </div>
  );
}
