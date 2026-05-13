export function getMutationRules(era: string) {
  if (era === "Genesis Era") {
    return {
      stageChance: 0.25,
      anomalyChance: 0.15,
      forceConvergence: false
    };
  }

  if (era === "Era of Spiral Instability") {
    return {
      stageChance: 0.5,
      anomalyChance: 0.7,
      forceConvergence: false
    };
  }

  if (era === "Age of Fractures") {
    return {
      stageChance: 0.8,
      anomalyChance: 0.85,
      forceConvergence: false
    };
  }

  if (era === "The Silence Bloom") {
    return {
      stageChance: 0.05,
      anomalyChance: 0.02,
      forceConvergence: false
    };
  }

  if (era === "Era of Convergence") {
    return {
      stageChance: 1,
      anomalyChance: 0.25,
      forceConvergence: true
    };
  }

  return {
    stageChance: 0.3,
    anomalyChance: 0.3,
    forceConvergence: false
  };
}
