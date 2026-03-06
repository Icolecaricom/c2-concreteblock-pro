'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  ArrowRight,
  CheckCircle,
  Info,
  DollarSign,
  Package,
} from 'lucide-react';

interface CalculationResult {
  squareFeet: number;
  blocksNeeded: number;
  recommendedBlocks: number;
  extraBlocks: number;
  estimatedMinCost: number;
  estimatedMaxCost: number;
  blockType: string;
}

export function CalculatorSection() {
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [blockType, setBlockType] = useState<string>('4-inch');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const BLOCKS_PER_SQ_FT = 1.125;
  const EXTRA_PERCENTAGE = 0.05;

  const PRICES: Record<string, { min: number; max: number }> = {
    '4-inch': { min: 180, max: 220 },
    '6-inch': { min: 220, max: 240 },
  };

  const handleCalculate = () => {
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);

    if (isNaN(length) || isNaN(height) || length <= 0 || height <= 0) {
      return;
    }

    const squareFeet = length * height;
    const blocksNeeded = Math.ceil(squareFeet * BLOCKS_PER_SQ_FT);
    const extraBlocks = Math.ceil(blocksNeeded * EXTRA_PERCENTAGE);
    const recommendedBlocks = blocksNeeded + extraBlocks;
    const prices = PRICES[blockType];

    setResult({
      squareFeet: squareFeet.toFixed(2) as unknown as number,
      blocksNeeded,
      recommendedBlocks,
      extraBlocks,
      estimatedMinCost: recommendedBlocks * prices.min,
      estimatedMaxCost: recommendedBlocks * prices.max,
      blockType: blockType === '4-inch' ? '4-Inch Hollow Blocks' : '6-Inch Hollow Blocks',
    });
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetCalculator = () => {
    setWallLength('');
    setWallHeight('');
    setResult(null);
  };

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#F97316]/10 text-[#F97316] mb-4">Block Calculator</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Calculate Your Block Requirements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use our calculator to estimate the number of blocks needed for your project.
            We recommend adding 5% extra for cutting requirements.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="border-2 border-[#1E3A5F]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <Calculator className="h-5 w-5" />
                  Enter Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wallLength">Wall Length (feet)</Label>
                  <Input
                    id="wallLength"
                    type="number"
                    placeholder="e.g., 50"
                    value={wallLength}
                    onChange={(e) => setWallLength(e.target.value)}
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="wallHeight">Wall Height (feet)</Label>
                  <Input
                    id="wallHeight"
                    type="number"
                    placeholder="e.g., 10"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                    className="mt-1"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="blockType">Block Type</Label>
                  <Select value={blockType} onValueChange={setBlockType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select block type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-inch">
                        4-Inch Hollow Blocks (${PRICES['4-inch'].min}-${PRICES['4-inch'].max} GYD)
                      </SelectItem>
                      <SelectItem value="6-inch">
                        6-Inch Hollow Blocks (${PRICES['6-inch'].min}-${PRICES['6-inch'].max} GYD)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleCalculate}
                    className="flex-1 bg-[#F97316] hover:bg-orange-600"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalculator}
                  >
                    Reset
                  </Button>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Standard calculation uses 1.125 blocks per square foot. We add 5% extra for cutting requirements.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className={`border-2 ${result ? 'border-[#F97316]' : 'border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <Package className="h-5 w-5" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Wall Area</p>
                        <p className="text-2xl font-bold text-[#1E3A5F]">
                          {result.squareFeet}
                        </p>
                        <p className="text-xs text-gray-400">sq ft</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Blocks Needed</p>
                        <p className="text-2xl font-bold text-[#1E3A5F]">
                          {result.blocksNeeded}
                        </p>
                        <p className="text-xs text-gray-400">blocks</p>
                      </div>
                    </div>

                    <div className="bg-[#F97316]/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Recommended Order:</span>
                        <span className="text-xl font-bold text-[#F97316]">
                          {result.recommendedBlocks} blocks
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Includes {result.extraBlocks} extra blocks (5% for cutting)
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-700">Estimated Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ${result.estimatedMinCost.toLocaleString()} - ${result.estimatedMaxCost.toLocaleString()} GYD
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {result.blockType} pricing
                      </p>
                    </div>

                    <Button
                      onClick={scrollToContact}
                      className="w-full bg-[#1E3A5F] hover:bg-[#152d4a]"
                    >
                      Request Quote for This Project
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter your wall dimensions and click Calculate to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
              Calculation Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Measure Twice</p>
                  <p className="text-sm text-gray-500">
                    Always double-check your measurements before calculating
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Add Extra</p>
                  <p className="text-sm text-gray-500">
                    We recommend 5-10% extra for breakage and cutting
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Get Expert Help</p>
                  <p className="text-sm text-gray-500">
                    Contact us for free consultation on your project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
