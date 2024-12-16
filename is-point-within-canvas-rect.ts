import Konva from "konva";

interface Point {
  x: number;
  y: number;
}

export function isPointWithinCanvasRect(stage: Konva.Stage, point: Point) {
  // Assuming the scale is the same for x and y
  const stageScale = stage.scaleX();
  const stagePosition = stage.position();
  const pointX = point.x * stageScale + stagePosition.x;
  const pointY = point.y * stageScale + stagePosition.y;
  const spacingAroundCanvasIncluded = 50;

  return (
    pointX >= 0 - spacingAroundCanvasIncluded &&
    pointX <= stage.width() + spacingAroundCanvasIncluded &&
    pointY >= 0 - spacingAroundCanvasIncluded &&
    pointY <= stage.height() + spacingAroundCanvasIncluded
  );
}
