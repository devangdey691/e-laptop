import React, { useEffect, useRef } from "react";

const Tech3DCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Dimensions
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Track Mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Normalize mouse coordinates to range [-1, 1]
      mouseRef.current.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.targetY = ((e.clientY - rect.top) / height) * 2 - 1;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // 3D Point Generation (Sphere)
    const numPoints = 65;
    const spherePoints = [];
    const rSphere = 100;
    for (let i = 0; i < numPoints; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      spherePoints.push({
        x: rSphere * Math.sin(phi) * Math.cos(theta),
        y: rSphere * Math.sin(phi) * Math.sin(theta),
        z: rSphere * Math.cos(phi),
      });
    }

    // Orbiting Tech Labels
    const techLabels = [
      { text: "AI Core", angle: 0, color: "#6366F1" },
      { text: "RTX 5090", angle: (Math.PI * 2) / 5, color: "#10B981" },
      { text: "Dolby Atmos", angle: ((Math.PI * 2) / 5) * 2, color: "#3B82F6" },
      { text: "144Hz OLED", angle: ((Math.PI * 2) / 5) * 3, color: "#EC4899" },
      { text: "5G Smart", angle: ((Math.PI * 2) / 5) * 4, color: "#F59E0B" },
    ];

    // Rotation variables
    let angleX = 0;
    let angleY = 0;

    // Helper: Rotate 3D point around X and Y axes
    const rotate3D = (x, y, z, ax, ay) => {
      // Rotate around X axis
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      // Rotate around Y axis
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      let x2 = x * cosY - z1 * sinY;
      let z2 = x * sinY + z1 * cosY;

      return { x: x2, y: y1, z: z2 };
    };

    // Draw projected ring
    const drawRing = (angleX, angleY, radius, tiltZ, color, opacity = 0.3) => {
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        // Ring in local X-Z plane
        let x = radius * Math.cos(theta);
        let y = 0;
        let z = radius * Math.sin(theta);

        // Apply tilt around Z axis
        const cosTilt = Math.cos(tiltZ);
        const sinTilt = Math.sin(tiltZ);
        const rx = x * cosTilt - y * sinTilt;
        const ry = x * sinTilt + y * cosTilt;
        const rz = z;

        // Apply global rotation
        const rotated = rotate3D(rx, ry, rz, angleX, angleY);

        // Project
        const fov = 350;
        const scale = fov / (fov + rotated.z);
        const sx = width / 2 + rotated.x * scale;
        const sy = height / 2 + rotated.y * scale;

        if (i === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow (lerping)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Global rotation based on time + mouse drift
      angleX = Date.now() * 0.0003 + mouseRef.current.y * 0.5;
      angleY = Date.now() * 0.0004 + mouseRef.current.x * 0.5;

      // 1. Draw Background Gyro Rings
      drawRing(angleX, angleY, 130, Math.PI / 6, "#6366F1", 0.25);
      drawRing(angleX, angleY, 140, -Math.PI / 4, "#10B981", 0.2);

      // 2. Project Sphere Points
      const projectedPoints = spherePoints.map((pt) => {
        const rotated = rotate3D(pt.x, pt.y, pt.z, angleX, angleY);
        const fov = 350;
        const scale = fov / (fov + rotated.z);
        return {
          x: width / 2 + rotated.x * scale,
          y: height / 2 + rotated.y * scale,
          z: rotated.z,
          scale,
        };
      });

      // 3. Draw Network Mesh Lines (connect points that are close)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 0.8;
      const maxDistanceSq = 45 * 45; // limit connections
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const dx = projectedPoints[i].x - projectedPoints[j].x;
          const dy = projectedPoints[i].y - projectedPoints[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistanceSq) {
            ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
            ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
          }
        }
      }
      ctx.stroke();

      // 4. Draw Particles (Sorted by depth so back particles are behind)
      const sortedPoints = [...projectedPoints].sort((a, b) => b.z - a.z);
      sortedPoints.forEach((pt) => {
        // Back particles have positive Z (further), front have negative Z (closer)
        const alpha = Math.max(0.15, Math.min(1.0, 1 - (pt.z + 100) / 200));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2 * pt.scale, 0, Math.PI * 2);
        
        // Dynamic colors (mix indigo and emerald based on position)
        if (pt.z < 0) {
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`; // Emerald in front
        } else {
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo in back
        }
        ctx.shadowBlur = pt.z < -20 ? 8 : 0;
        ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Update and Draw Orbiting Tech Labels (Depth sorted)
      const labelRadius = 150;
      const projectedLabels = techLabels.map((lbl) => {
        lbl.angle += 0.005; // slowly orbit
        const lx = labelRadius * Math.cos(lbl.angle);
        const ly = 15 * Math.sin(lbl.angle); // subtle vertical wave
        const lz = labelRadius * Math.sin(lbl.angle);

        const rotated = rotate3D(lx, ly, lz, angleX * 0.5, angleY * 0.8);
        const fov = 350;
        const scale = fov / (fov + rotated.z);
        return {
          text: lbl.text,
          color: lbl.color,
          x: width / 2 + rotated.x * scale,
          y: height / 2 + rotated.y * scale,
          z: rotated.z,
          scale,
        };
      });

      // Render labels from back to front
      projectedLabels.sort((a, b) => b.z - a.z).forEach((lbl) => {
        const opacity = Math.max(0.2, Math.min(1.0, 1 - (lbl.z + 120) / 240));
        ctx.globalAlpha = opacity;

        // Draw node connection line
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(lbl.x, lbl.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Label Background Tag
        ctx.font = `${Math.round(10 * lbl.scale)}px sans-serif`;
        const textWidth = ctx.measureText(lbl.text).width;
        const paddingX = 8;

        const rectW = textWidth + paddingX * 2;
        const rectH = 16 * lbl.scale;

        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = `${lbl.color}80`; // colored outline
        ctx.lineWidth = 1;
        
        // Draw round rectangle for text badge
        const rx = lbl.x - rectW / 2;
        const ry = lbl.y - rectH / 2;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(rx, ry, rectW, rectH, 6) : ctx.rect(rx, ry, rectW, rectH);
        ctx.fill();
        ctx.stroke();

        // Label Text
        ctx.fillStyle = "#F8FAFC";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(lbl.text, lbl.x, lbl.y);
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Visual background rings */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default Tech3DCanvas;
