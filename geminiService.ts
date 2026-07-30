export interface CustomAiEstimateRequest {
  category: string;
  dimensions: string;
  woodType: string;
  colourStain: string;
  fabricOption?: string;
  specialRequirements: string;
}

export interface CustomAiEstimateResponse {
  estimatedPriceMinPkr: number;
  estimatedPriceMaxPkr: number;
  woodcraftNotes: string;
  recommendedFinish: string;
  productionDays: number;
  craftsmanshipTips: string[];
}

export async function getAiCustomFurnitureEstimate(reqData: CustomAiEstimateRequest): Promise<CustomAiEstimateResponse> {
  try {
    const response = await fetch('/api/ai-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI quote');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Falling back to local estimation logic:', error);
    // Intelligent fallback estimation calculation
    let basePrice = 80000;
    if (reqData.category.includes('Bed') || reqData.category.includes('Sofa')) basePrice = 180000;
    if (reqData.category.includes('Dining')) basePrice = 220000;
    if (reqData.category.includes('Wardrobe')) basePrice = 190000;

    let woodMultiplier = 1.0;
    if (reqData.woodType.includes('Sheesham')) woodMultiplier = 1.35;
    if (reqData.woodType.includes('Teak')) woodMultiplier = 1.45;
    if (reqData.woodType.includes('Walnut')) woodMultiplier = 1.5;

    const estimatedMin = Math.round(basePrice * woodMultiplier);
    const estimatedMax = Math.round(estimatedMin * 1.25);

    return {
      estimatedPriceMinPkr: estimatedMin,
      estimatedPriceMaxPkr: estimatedMax,
      woodcraftNotes: `Custom ${reqData.woodType} crafting with hand-selected seasoned timber for moisture stability in Pakistani climate.`,
      recommendedFinish: `${reqData.colourStain} with PU protective lacquer coat`,
      productionDays: 10,
      craftsmanshipTips: [
        'Seasoned kiln-dried wood prevents seasonal warping or cracking',
        'Traditional mortise and tenon joinery for multi-generational durability',
        'Includes 10-Year Termite Proofing Guarantee from Iqbal Woodcraft'
      ]
    };
  }
}

export async function askAiFurnitureAdvisor(
  prompt: string, 
  contextCategory?: string,
  productCatalog?: any[],
  userBudget?: number,
  roomSize?: string
): Promise<string> {
  try {
    const response = await fetch('/api/ai-consultant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, contextCategory, productCatalog, userBudget, roomSize }),
    });

    if (!response.ok) {
      throw new Error('Advisor route failed');
    }

    const data = await response.json();
    return data.reply;
  } catch (err) {
    return `Assalam-o-Alaikum! Thank you for consulting IQBAL WOODCRAFT AI Consultant. For personalized advice regarding ${contextCategory || 'your furniture selection'}, our Master Craftsmanship team is available 24/7 on WhatsApp: 0309-3509242 or Call 0302-0940219 (Muhammad Zahid Iqbal). We specialize in 100% Solid Sheesham & Teak Wood custom carving tailored for Pakistani homes.`;
  }
}
