// src/app/dashboard/pages/Home.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function Home() {
  const totalVisitors = chartData.reduce((acc, { visitors }) => acc + visitors, 0)

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <Card className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Task1</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Some Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-gray-500 dark:text-gray-400">Thank you for visiting this awesome Task.</p>
            </CardFooter>
          </Card> */}

<Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>

          <Card className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Task2</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Some Infoormation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-gray-500 dark:text-gray-400">Thank you for visiting this awesome Task.</p>
            </CardFooter>
          </Card>

          <Card className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Task3</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Some Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                  <p className="mt-1 text-gray-900 dark:text-white"></p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-gray-500 dark:text-gray-400">Thank you for visiting this awesome Task.</p>
            </CardFooter>
          </Card>

          {/* Add more cards as needed */}
        </div>
      </div>
    </div>
  );
}