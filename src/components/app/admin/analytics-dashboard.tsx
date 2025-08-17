
"use client";

import React from "react";
import { Users, UserCheck, TrendingUp, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  BarChart
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "Enero", signups: 186, revenue: 2200 },
  { month: "Febrero", signups: 305, revenue: 2500 },
  { month: "Marzo", signups: 237, revenue: 2800 },
  { month: "Abril", signups: 273, revenue: 3500 },
  { month: "Mayo", signups: 209, revenue: 3200 },
  { month: "Junio", signups: 214, revenue: 4100 },
];

const chartConfig = {
  signups: {
    label: "Nuevos registros",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Ingresos Generados ($)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function AnalyticsDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Panel</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miembros totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Retención
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.3%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV del Cliente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125.50</div>
            <p className="text-xs text-muted-foreground">
              +5% desde el último trimestre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros activos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,450</div>
            <p className="text-xs text-muted-foreground">
              +10.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visión general del Crecimiento</CardTitle>
            <CardDescription>
                Nuevos registros e ingresos generados por el programa.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    yAxisId="right"
                    dataKey="signups"
                    fill="var(--color-signups)"
                    radius={4}
                  />
                  <Line
                    yAxisId="left"
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>
              Últimas transacciones significativas de los miembros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                 <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Compra en tienda física.
                  </p>
                </div>
                <div className="ml-auto font-medium">+$99.00</div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Compra en la tienda
                  </p>
                </div>
                <div className="ml-auto font-medium">+$25.50</div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                   <p className="text-sm text-muted-foreground">
                    Compra en la tienda
                  </p>
                </div>
                <div className="ml-auto font-medium">+$150.00</div>
              </div>
               <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                   <p className="text-sm text-muted-foreground">
                    Compra en la tienda
                  </p>
                </div>
                <div className="ml-auto font-medium">+$78.20</div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Compra en la tienda
                  </p>
                </div>
                <div className="ml-auto font-medium">+$42.80</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
