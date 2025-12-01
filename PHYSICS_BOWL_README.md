# Physics-Based Bowl System

## Overview
The bowl visualization has been updated with a realistic physics engine that simulates cereals falling and settling in a bowl with gravity, collision detection, and friction.

## Features Implemented

### 1. **PhysicsParticle Class**
- Each cereal piece is represented as a physics particle with:
  - Position (x, y)
  - Velocity (vx, vy) - horizontal and vertical
  - Rotation and rotation speed
  - Settled state tracking

### 2. **Physics Simulation**
- **Gravity**: Constant downward acceleration (0.3 units/frame²)
- **Air Friction**: 0.98 damping factor simulating air resistance
- **Velocity Updates**: Particles accelerate downward and their position updates each frame

### 3. **Bowl Collision Detection**
- The bowl is defined as a circular container positioned at coordinates (centerX, centerY) with a radius
- When particles get close to the bowl surface:
  - They bounce off the curved surface
  - They gradually lose velocity (damping = 0.5)
  - Once velocity drops below 0.5 units, they "settle" into place
  - Settled particles remain in the bowl and are cleaned up after 30 frames

### 4. **Boundary Collision**
- Left/right wall collisions with 0.6x velocity reversal
- Bottom boundary collision with 0.3x velocity reversal
- Prevents particles from escaping the viewport

### 5. **Visual Rendering**
- **Bowl Container**: Semi-transparent radial gradient creates a 3D bowl effect
- **Particles**: Rendered as SVG shapes with proper positioning and rotation
- **Drop Shadow**: Subtle shadows on particles for depth perception

## How It Works

1. **Click to Add**: When you click "Add to bowl" for a cereal:
   - 4 particle instances are created at random horizontal positions, starting above the viewport
   - Each particle has a unique velocity and rotation speed

2. **Physics Loop**: 
   - Every animation frame:
     - Gravity is applied (accelerates particles downward)
     - Air friction slows horizontal and vertical movement
     - Collision detection with bowl surface
     - Boundary collision checks
     - Particles are rendered at their new positions

3. **Settling**: 
   - Once particles slow down significantly in the bowl, they settle
   - Settled particles are kept in the bowl visually but stop simulating
   - After settling for 30+ frames, they're removed from the simulation

## Key Physics Parameters

```javascript
const gravity = 0.3;        // Downward acceleration
const friction = 0.98;      // Air resistance
const damping = 0.99;       // Energy loss in collisions
const bowlRadius = 150px;   // Approximate bowl size
const bounceForce = 0.3;    // Force when hitting bowl surface
```

## Visual Bowl

The bowl is created using CSS with:
- A radial gradient for 3D appearance
- Inset shadows for depth
- Positioned at 65% down the viewport
- ~300px diameter (scales with window)

## Future Enhancements

Possible improvements:
- Particle-to-particle collisions for more realistic stacking
- Physics-based mounding (stack cereals on top of each other)
- Adjustable physics parameters (gravity, friction) via UI
- Sound effects on collision
- Particle trails/motion blur
- Bowl tilt/rotation interactions
