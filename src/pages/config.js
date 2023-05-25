import { Triplet } from '@react-three/cannon'

const jointNames = [
  'neckJoint',
  'leftKneeJoint',
  'rightKneeJoint',
  'leftHipJoint',
  'rightHipJoint',
  'spineJoint',
  'leftShoulder',
  'rightShoulder',
  'leftElbowJoint',
  'rightElbowJoint',
]

const shapeNames = [
  'lowerLeftLeg',
  'lowerRightLeg',
  'upperLeftLeg',
  'upperRightLeg',
  'pelvis',
  'upperBody',
  'head',
  'upperLeftArm',
  'upperRightArm',
  'lowerLeftArm',
  'lowerRightArm',
];

// Converted from the createRagdoll method in CANNON js ragdoll demo
export function createRagdoll(scale, angleA = 0, angleB = 0, twistAngle = 0) {
  const shouldersDistance = 0.45 * scale,
    upperArmLength = 0.4 * scale,
    lowerArmLength = 0.4 * scale,
    upperArmSize = 0.15 * scale,
    lowerArmSize = 0.15 * scale,
    neckLength = 0.1 * scale,
    headRadius = 0.2 * scale,
    upperBodyLength = 0.6 * scale,
    pelvisLength = 0.2 * scale,
    upperLegLength = 0.5 * scale,
    upperLegSize = 0.15 * scale,
    lowerLegSize = 0.15 * scale,
    lowerLegLength = 0.5 * scale

  // Lower legs
  const lowerLeftLeg = {
    args: [lowerLegSize * 0.5, lowerLegLength * 0.5, lowerArmSize * 0.5],
    color: 'lightblue',
    mass: scale,
    position: [-shouldersDistance / 3, lowerLegLength / 2, 0],
  }
  const lowerRightLeg = {
    args: [lowerLegSize * 0.5, lowerLegLength * 0.5, lowerArmSize * 0.5],
    color: 'lightblue',
    mass: scale,
    position: [shouldersDistance / 3, lowerLegLength / 2, 0],
  }

  // Upper legs
  const upperLeftLeg = {
    args: [upperLegSize * 0.5, upperLegLength * 0.5, lowerArmSize * 0.5],
    color: 'lightblue',
    mass: scale,
    position: [-shouldersDistance / 3, lowerLeftLeg.position[1] + lowerLegLength / 2 + upperLegLength / 2, 0],
  }
  const upperRightLeg = {
    args: [upperLegSize * 0.5, upperLegLength * 0.5, lowerArmSize * 0.5],
    color: 'lightblue',
    mass: scale,
    position: [shouldersDistance / 3, lowerRightLeg.position[1] + lowerLegLength / 2 + upperLegLength / 2, 0],
  }

  // Pelvis
  const pelvis = {
    args: [shouldersDistance * 0.5, pelvisLength * 0.5, lowerArmSize * 0.5],
    color: 'lightblue',
    mass: scale,
    position: [0, upperLeftLeg.position[1] + upperLegLength / 2 + pelvisLength / 2, 0],
  }

  // Upper body
  const upperBody = {
    args: [shouldersDistance * 0.5, upperBodyLength * 0.5, lowerArmSize * 0.75],
    color: 'indianred',
    mass: scale,
    position: [0, pelvis.position[1] + pelvisLength / 2 + upperBodyLength / 2, 0],
  }

  // Head
  const head = {
    args: [headRadius * 0.6, headRadius * 0.7, headRadius * 0.6],
    color: 'lightpink',
    mass: scale,
    position: [0, upperBody.position[1] + upperBodyLength / 2 + headRadius / 2 + neckLength, 0],
  }

  // Upper arms
  const upperLeftArm = {
    args: [upperArmLength * 0.5, upperArmSize * 0.5, upperArmSize * 0.5],
    color: 'indianred',
    mass: scale,
    position: [-shouldersDistance / 2 - upperArmLength / 2, upperBody.position[1] + upperBodyLength / 2, 0],
  }
  const upperRightArm = {
    args: [upperArmLength * 0.5, upperArmSize * 0.5, upperArmSize * 0.5],
    color: 'indianred',
    mass: scale,
    position: [shouldersDistance / 2 + upperArmLength / 2, upperBody.position[1] + upperBodyLength / 2, 0],
  }

  // lower arms
  const lowerLeftArm = {
    args: [lowerArmLength * 0.5, lowerArmSize * 0.5, lowerArmSize * 0.5],
    color: 'lightpink',
    mass: scale,
    position: [
      upperLeftArm.position[0] - lowerArmLength / 2 - upperArmLength / 2,
      upperLeftArm.position[1],
      0,
    ],
  }
  const lowerRightArm = {
    args: [lowerArmLength * 0.5, lowerArmSize * 0.5, lowerArmSize * 0.5],
    color: 'lightpink',
    mass: scale,
    position: [
      upperRightArm.position[0] + lowerArmLength / 2 + upperArmLength / 2,
      upperRightArm.position[1],
      0,
    ],
  }

  // joints

  // Neck joint
  const neckJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'head',
    bodyB: 'upperBody',
    pivotA: [0, -headRadius - neckLength / 2, 0],
    pivotB: [0, upperBodyLength / 2, 0],
    twistAngle: twistAngle,
  }

  // Knee joints
  const leftKneeJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'lowerLeftLeg',
    bodyB: 'upperLeftLeg',
    pivotA: [0, lowerLegLength / 2, 0],
    pivotB: [0, -upperLegLength / 2, 0],
    twistAngle: twistAngle,
  }
  const rightKneeJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'lowerRightLeg',
    bodyB: 'upperRightLeg',
    pivotA: [0, lowerLegLength / 2, 0],
    pivotB: [0, -upperLegLength / 2, 0],
    twistAngle: twistAngle,
  }

  // Hip joints
  const leftHipJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'upperLeftLeg',
    bodyB: 'pelvis',
    pivotA: [0, upperLegLength / 2, 0],
    pivotB: [-shouldersDistance / 3, -pelvisLength / 2, 0],
    twistAngle: twistAngle,
  }
  const rightHipJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'upperRightLeg',
    bodyB: 'pelvis',
    pivotA: [0, upperLegLength / 2, 0],
    pivotB: [shouldersDistance / 3, -pelvisLength / 2, 0],
    twistAngle: twistAngle,
  }

  // Spine
  const spineJoint = {
    angle: angleA,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    bodyA: 'pelvis',
    bodyB: 'upperBody',
    pivotA: [0, pelvisLength / 2, 0],
    pivotB: [0, -upperBodyLength / 2, 0],
    twistAngle: twistAngle,
  }

  // Shoulders
  const leftShoulder = {
    angle: angleB,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: 'upperBody',
    bodyB: 'upperLeftArm',
    pivotA: [upperArmLength / 2, 0, 0],
    pivotB: [-shouldersDistance / 2, upperBodyLength / 2, 0],
  }
  const rightShoulder = {
    angle: angleB,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: 'upperBody',
    bodyB: 'upperRightArm',
    pivotA: [-upperArmLength / 2, 0, 0],
    pivotB: [shouldersDistance / 2, upperBodyLength / 2, 0],
    twistAngle: twistAngle,
  }

  // Elbow joint
  const leftElbowJoint = {
    angle: angleA,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: 'lowerLeftArm',
    bodyB: 'upperLeftArm',
    pivotA: [lowerArmLength / 2, 0, 0],
    pivotB: [-upperArmLength / 2, 0, 0],
    twistAngle: twistAngle,
  }
  const rightElbowJoint = {
    angle: angleA,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: 'lowerRightArm',
    bodyB: 'upperRightArm',
    pivotA: [-lowerArmLength / 2, 0, 0],
    pivotB: [upperArmLength / 2, 0, 0],
    twistAngle: twistAngle,
  }

  return {
    joints: {
      leftElbowJoint,
      leftHipJoint,
      leftKneeJoint,
      leftShoulder,
      neckJoint,
      rightElbowJoint,
      rightHipJoint,
      rightKneeJoint,
      rightShoulder,
      spineJoint,
    },
    shapes: {
      head,
      lowerLeftArm,
      lowerLeftLeg,
      lowerRightArm,
      lowerRightLeg,
      pelvis,
      upperBody,
      upperLeftArm,
      upperLeftLeg,
      upperRightArm,
      upperRightLeg,
    },
  }
}