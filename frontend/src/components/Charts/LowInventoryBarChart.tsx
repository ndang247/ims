import { IInventory, ILowInventoryBarChartProps } from "@src/types";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const LowInventoryBarChart: React.FC<ILowInventoryBarChartProps> = ({
  lowInventoryItems,
}) => {
  const productNames = lowInventoryItems.map(
    (item: IInventory) => item.product.barcode
  );
  const productQuantities = lowInventoryItems.map((item: IInventory) => {
    if (item.parcel_quantity < 5) {
      return item.parcel_quantity;
    }
  });

  useEffect(() => {
    console.log(productNames);
    console.log(productQuantities);
  }, []);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Number of Parcels",
        data: productQuantities,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "x" as const, // Horizontal bar chart
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Low Inventory Items",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LowInventoryBarChart;
