/* eslint-disable @typescript-eslint/naming-convention */
import { DECREASE_ONE, INCREASE_ONE, MONTHS_IN_YEAR } from '@app/constants/Common';
import { Document, Model } from 'mongoose';

// Define the structure of the data for each month
interface IMonthData {
  month: string;
  count: number;
}

// Define the function to generate the last 12 months data
export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: IMonthData[] }> {
  // Initialize an array to store the data for each month
  const last12Months: IMonthData[] = [];
  const currentDate = new Date();
  const initValue = 0;
  const firstDayOfMonth = 1;

  // Loop through the last 12 months
  for (let i = MONTHS_IN_YEAR - DECREASE_ONE; i >= initValue; i--) {
    // Calculate the start and end dates for the current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, firstDayOfMonth);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + INCREASE_ONE, initValue);

    // Format the month and year for display
    const monthYear = startOfMonth.toLocaleString('default', { month: 'short', year: 'numeric' });

    // Count the documents created in the specific month
    const count = await model.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lt: endOfMonth // Use $lt instead of $lte to exclude the current day
      }
    });

    last12Months.push({ month: monthYear, count });
  }

  // Return the generated data as an object
  return { last12Months };
}
