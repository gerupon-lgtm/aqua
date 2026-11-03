import { renderBoard, basinPlacement, pipePath, pipeCrossings, pipeLabelPositions, boardViewBox } from '../src/ui/board.js';
import { createOutletLabelLayout } from '../src/ui/outlet-label-layout.js';
const diagnosticLayout = createOutletLabelLayout({ basinPlacement, pipePath, pipeCrossings, pipeLabelPositions, boardViewBox });
export function renderElbow(svg, model) {
  renderBoard(svg, model);
  return diagnosticLayout.placements(model.layout, model.stage);
}
