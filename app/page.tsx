"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

interface TaxBracket {
  max: number;
  rate: number;
}

interface SalaryResult {
  grossSalary: number;
  incomeTax: number;
  pensionContribution: number;
  netSalary: number;
}

export default function Home() {
  const [grossSalary, setGrossSalary] = useState<string>("");
  const [netSalary, setNetSalary] = useState<string>("");
  const [result, setResult] = useState<SalaryResult | null>(null);

  const taxBrackets: TaxBracket[] = [
    { max: 600, rate: 0 },
    { max: 1650, rate: 0.1 },
    { max: 3200, rate: 0.15 },
    { max: 5250, rate: 0.2 },
    { max: 7800, rate: 0.25 },
    { max: 10900, rate: 0.3 },
    { max: Infinity, rate: 0.35 },
  ];

  const employeePensionRate: number = 0.07;

  const calculateNetSalary = (): void => {
    const salary = parseFloat(grossSalary);

    if (isNaN(salary) || salary < 0) {
      alert("Please enter a valid gross salary.");
      return;
    }

    const result = calculateTaxAndPension(salary);
    setNetSalary(result.netSalary.toFixed(2));
    setResult(result);
  };

  const calculateGrossSalary = (): void => {
    const targetNet = parseFloat(netSalary);

    if (isNaN(targetNet) || targetNet < 0) {
      alert("Please enter a valid net salary.");
      return;
    }

    let low = 0;
    let high = targetNet * 2; // Assuming gross is at most 2 times the net
    let mid = (low + high) / 2; // Initialize mid
    let result = calculateTaxAndPension(mid); // Initialize result

    while (high - low > 0.01) {
      // 0.01 birr precision
      if (result.netSalary > targetNet) {
        high = mid;
      } else if (result.netSalary < targetNet) {
        low = mid;
      } else {
        break;
      }
      mid = (low + high) / 2;
      result = calculateTaxAndPension(mid);
    }

    setResult(result);
    setGrossSalary(mid.toFixed(2));
  };

  const calculateTaxAndPension = (salary: number): SalaryResult => {
    const taxableIncome = salary;
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of taxBrackets) {
      if (remainingIncome > 0) {
        const taxableAmount = Math.min(
          remainingIncome,
          bracket.max -
            (bracket === taxBrackets[0]
              ? 0
              : taxBrackets[taxBrackets.indexOf(bracket) - 1].max)
        );
        tax += taxableAmount * bracket.rate;
        remainingIncome -= taxableAmount;
      } else {
        break;
      }
    }

    const pensionContribution = salary * employeePensionRate;
    const netSalary = salary - tax - pensionContribution;

    return {
      grossSalary: salary,
      incomeTax: tax,
      pensionContribution: pensionContribution,
      netSalary: netSalary,
    };
  };

  return (
    <div className="min-h-screen bg-gray-400 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Salary Calculator</title>
        <meta
          name="description"
          content="Calculate your net and gross salary in Ethiopia"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Salary Calculator
              </h1>
            </div>
            <div className="divide-y divide-gray-600">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Gross Salary (Birr)</label>
                  <input
                    type="number"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter gross salary"
                    value={grossSalary}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGrossSalary(e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={calculateNetSalary}
                  >
                    Calculate Net Salary
                  </button>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Net Salary (Birr)</label>
                  <input
                    type="number"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter net salary"
                    value={netSalary}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNetSalary(e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-green-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={calculateGrossSalary}
                  >
                    Calculate Gross Salary
                  </button>
                </div>
              </div>
              {result && (
                <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8 space-y-6">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Salary Calculation Result
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-700">
                          Gross Salary:
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {result.grossSalary.toFixed(2)} Br
                          <span className="ml-2 text-2xl">🎉🤣😂</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-700">
                          Income Tax:
                        </p>
                        <p className="text-xl font-bold text-red-600">
                          {result.incomeTax.toFixed(2)} Br
                          <span className="ml-2 text-2xl">🤒😠😱</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-700">
                          Pension (7%):
                        </p>
                        <p className="text-xl font-bold text-orange-600">
                          {result.pensionContribution.toFixed(2)} Br
                          <span className="ml-2 text-2xl">🙄😏🫤</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-700">
                          Net Salary:
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {result.netSalary.toFixed(2)} Br
                          <span className="ml-2 text-2xl">🥹😭</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="relative w-full pb-[65%]">
                      <Image
                        src="/giphy.webp"
                        alt="Local GIF"
                        layout="fill"
                        className="absolute"
                      />
                    </div>
                    <p className="text-black">This is not fair🥹</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
