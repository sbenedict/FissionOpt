#ifndef _OPT_OVERHAUL_FISSION_H_
#define _OPT_OVERHAUL_FISSION_H_
#include <random>
#include "OverhaulFission.h"

namespace OverhaulFission {
  struct Sample {
    int limits[Tiles::Air];
    int sourceLimits[3];
    std::vector<int> cellLimits;
    xt::xtensor<int, 3> state;
    Evaluation value, valueWithShield;
  };

  enum {
    StageTrain = -2,
    StageInfer
  };

  constexpr int interactiveMin(1024), interactiveScale(81920), interactiveNet(16), nLossHistory(256);

  class Net;

  class Opt {
    friend Net;
    const Settings &settings;
    std::vector<Coord> allowedCoords;
    std::vector<int> allowedTiles;
    int nEpisode, nStage, nIteration;
    int nConverge, maxConverge;
    double infeasibilityPenalty;
    double parentFitness;
    Sample parent, best;
    std::array<Sample, 4> children;
    std::mt19937 rng;
    std::unique_ptr<Net> net;
    bool inferenceFailed;
    bool bestChanged;
    int redrawNagle;
    std::vector<double> lossHistory;
    bool lossChanged;
    void restart();
    bool feasible(const Sample &x);
    double infeasibility(const Sample &x);
    double rawFitness(const Evaluation &x);
    double currentFitness(const Sample &x);
    int getNSym(int x, int y, int z);
    void setTileWithSym(Sample &sample, int x, int y, int z, int tile);
    void mutateAndEvaluate(Sample &sample, int x, int y, int z);
  public:
    Opt(Settings &settings);
    void step();
    void stepInteractive();
    bool needsRedrawBest();
    bool needsReplotLoss();
    const std::vector<double> &getLossHistory() const { return lossHistory; }
    const Sample &getBest() const { return best; }
    int getNEpisode() const { return nEpisode; }
    int getNStage() const { return nStage; }
    int getNIteration() const { return nIteration; }
  };
}

#endif
