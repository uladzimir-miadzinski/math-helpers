// Right triangle:
//   A (x1, y1)
//   |\
//   |α\
//   |  \
// b |   \ с - hypotenuse
//   |    \
//   |     \
//   |      \
//   |γ=90° β\
//   |        \
//   C ------- B (?, ?) - need to find this point coords
// It is customary to denote the vertex of a right angle by the letter C, and the hypotenuse by c.
// The legs are designated a and b, and the values of the angles opposite them are α and β, respectively.

import {Point} from '../types';

interface Triangle {
    pointA?: Point; // A point coords
    pointB?: Point; // B point coords
    pointC?: Point; // C point coords
    sideA?: number;
    sideB?: number;
    sideC?: number; // hypotenuse c.
}

function findThirdTriangleVertex(T: Triangle, swap?: boolean): Point {
    // Unit vector:
    const unitVec: Point = {
        x: (T.pointA.x - T.pointC.x) / T.sideB,
        y: (T.pointA.y - T.pointC.y) / T.sideB,
    };

    if (swap) {
        // first solution
        return {
            x: T.pointC.x + -unitVec.y * T.sideA,
            y: T.pointC.y + unitVec.x * T.sideA,
        };
    } else {
        // second solution (mirror AC)
        return {
            x: T.pointC.x + unitVec.y * T.sideA,
            y: T.pointC.y + -unitVec.x * T.sideA,
        };
    }
}

function calcDistance(source: Point, target: Point): number {
    if (target.x && target.y && source.x && source.y) {
        return Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
    }
}

function calcDistanceMiddlePoint(source: Point, target: Point): Point {
    return {
        x: (source.x + target.x) / 2,
        y: (source.y + target.y) / 2,
    };
}

/**
 * Calculate middle point B(x2, y2) coordinates above/below straight line to draw required arc
 * because we can't use simple ctx.arcTo or ctx.arc in Konva.Shape or Konva.Arrow sceneFn,
 * or Konva.Arc because we lost arrow that Konva.Arrow do for us
 * Arrow positioning depends on angle at the end of line connecting two nodes.
 * And it is not trivial to calculate it properly manually by ourselves instead of Konva.Arrow
 * But the good thing - Konva.Arrow accept 3 dots, that allows us to make it as curve using `tension` prop in its config
 */
export function calcArcHeightPoint(aPoint: Point, dPoint: Point, arcHeight?: number): Point {
    //   A (x1, y1)
    //   |\
    //   |α\
    //   |  \
    // b |   \ с
    //   |    \
    //   |     \
    //   |      \
    //   |γ=90° β\
    //   |        \
    //   C ------- B (?, ?) - need to find coords
    //   |   a    /
    //   |       /
    //   |      /
    //   |     /
    //   |    /
    //   |   /
    //   |  /
    //   | /
    //   |/
    //   D (x3, y3)
    const distanceAD = calcDistance(aPoint, dPoint);
    const distanceAC = distanceAD / 2;
    const triangle: Triangle = {
        pointA: aPoint,
        pointC: calcDistanceMiddlePoint(aPoint, dPoint),
        sideA: arcHeight,
        sideB: distanceAC,
    };

    return findThirdTriangleVertex(triangle);
}
