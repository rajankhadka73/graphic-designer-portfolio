'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import SectionHeader from '../ui/SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import Matter from 'matter-js';
import { SKILLS_LIST } from '@/lib/constants';

type PhysicsBody = { body: Matter.Body; element: HTMLDivElement; width: number; height: number };

export default function Skills() {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const rafRef = useRef<number>(0);
  const wallsRef = useRef<{ bottom: Matter.Body; left: Matter.Body; right: Matter.Body } | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const handleShuffle = useCallback(() => {
    const container = containerRef.current;
    if (!container || !engineRef.current) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;

    bodiesRef.current.forEach(({ body, width: bw, height: bh }) => {
      const rx = Math.random() * (w - bw) + bw / 2;
      const ry = -(Math.random() * 200 + bh + 30); // fall from above top edge
      
      // Wake up the body and reset velocities
      Matter.Body.setPosition(body, { x: rx, y: ry });
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setAngle(body, 0); // always horizontal
      
      // Explicitly wake up in case it was sleeping
      if ((body as any).isSleeping) {
        Matter.Sleeping.set(body, false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let localCleanUp: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const container = containerRef.current;
        if (!container) return;

        ScrollTrigger.create({
          trigger: container,
          start: 'top bottom-=50px',
          onEnter: () => { localCleanUp = initPhysics(container); },
          once: true,
        });
      }
    );

    function initPhysics(container: HTMLDivElement) {
      const { Engine, World, Bodies, Mouse, MouseConstraint, Runner, Events } = Matter;

      const eng = Engine.create({ constraintIterations: 4, positionIterations: 8, velocityIterations: 8 });
      eng.gravity.y = 1.0;
      engineRef.current = eng;

      const cr = container.getBoundingClientRect();
      const W = cr.width;
      const H = cr.height;
      const T = 100;

      const bottomWall = Bodies.rectangle(W / 2, H + T / 2, W, T, { isStatic: true });
      const leftWall   = Bodies.rectangle(-T / 2, H / 2 - 500, T, H + 1000, { isStatic: true });
      const rightWall  = Bodies.rectangle(W + T / 2, H / 2 - 500, T, H + 1000, { isStatic: true });
      wallsRef.current = { bottom: bottomWall, left: leftWall, right: rightWall };
      World.add(eng.world, [bottomWall, leftWall, rightWall]);

      const elements = container.querySelectorAll<HTMLDivElement>('.skill-physics-tag');
      const bodies: PhysicsBody[] = [];

      elements.forEach((el) => {
        el.style.opacity = '1';
        const rect = el.getBoundingClientRect();
        const elW = rect.width;
        const elH = rect.height;

        const rx = Math.random() * (W - elW) + elW / 2;
        const ry = -(Math.random() * 280 + elH);

        const body = Bodies.rectangle(rx, ry, elW, elH, {
          restitution: 0.45,
          friction: 0.04,
          frictionAir: 0.018,
          density: 0.001,
          angle: 0, // always start horizontal so cards are readable
        });

        bodies.push({ body, element: el, width: elW, height: elH });
        World.add(eng.world, body);
      });

      bodiesRef.current = bodies;

      // Ceiling removed to prevent blocking shuffle/drops. Lateral bounds extended instead.

      // Mouse constraint — do NOT lock inertia so rotation stays free
      const mouse = Mouse.create(container);
      (mouse as any).element.removeEventListener('mousewheel', (mouse as any).mousewheel);
      // Remove touchstart listener so mobile buttons inside container can fire
      (mouse as any).element.removeEventListener('touchstart', (mouse as any).mousedown);
      (mouse as any).element.removeEventListener('touchmove', (mouse as any).mousemove);
      (mouse as any).element.removeEventListener('touchend', (mouse as any).mouseup);
      // Determine if a tag is being touched to selectively block page scrolling
      let isDraggingTag = false;

      const touchStartHandler = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const isTag = target.closest('.skill-physics-tag');

        if (isTag) {
          isDraggingTag = true;
          e.preventDefault(); // Stop page scrolling when starting a tag drag
        } else {
          isDraggingTag = false;
        }

        const touch = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        mouse.position.x = touch.clientX - rect.left;
        mouse.position.y = touch.clientY - rect.top;
        (mouse as any).button = 0;
      };
      const touchMoveHandler = (e: TouchEvent) => {
        if (isDraggingTag) {
          e.preventDefault(); // Prevent page scrolling during drag
        }
        const touch = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        mouse.position.x = touch.clientX - rect.left;
        mouse.position.y = touch.clientY - rect.top;
      };
      const touchEndHandler = () => {
        (mouse as any).button = -1;
        isDraggingTag = false;
      };
      container.addEventListener('touchstart', touchStartHandler, { passive: false });
      container.addEventListener('touchmove', touchMoveHandler, { passive: false });
      container.addEventListener('touchend', touchEndHandler, { passive: true });

      const mc = MouseConstraint.create(eng, {
        mouse,
        constraint: { stiffness: 0.12, render: { visible: false } },
      });

      // Give a gentle angular impulse on release so throws feel rotational
      Events.on(mc, 'enddrag', (evt: any) => {
        const b: Matter.Body = evt.body;
        if (b) {
          // Angular velocity proportional to linear throw speed, capped
          const speed = Math.sqrt(b.velocity.x ** 2 + b.velocity.y ** 2);
          const dir = b.velocity.x > 0 ? 1 : -1;
          Matter.Body.setAngularVelocity(b, clamp(dir * speed * 0.012, -0.25, 0.25));
        }
      });

      const handleMouseUp = () => {
        if ((mc as any).constraint?.bodyB) {
          (mc as any).constraint.bodyB = null;
        }
      };

      const handleResize = () => {
        const nr = container.getBoundingClientRect();
        const nW = nr.width; const nH = nr.height;
        Matter.Body.setPosition(bottomWall, { x: nW / 2, y: nH + T / 2 });
        Matter.Body.setPosition(leftWall,   { x: -T / 2, y: nH / 2 - 500 });
        Matter.Body.setPosition(rightWall,  { x: nW + T / 2, y: nH / 2 - 500 });
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('resize', handleResize);
      World.add(eng.world, mc);

      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, eng);

      function updatePositions() {
        const nr = container.getBoundingClientRect();
        const cW = nr.width; const cH = nr.height;
        bodies.forEach(({ body, element, width: bw, height: bh }) => {
          const x = clamp(body.position.x, bw / 2, cW - bw / 2);
          const y = clamp(body.position.y, bh / 2, cH - bh / 2);
          element.style.transform = `translate3d(${x - bw / 2}px, ${y - bh / 2}px, 0) rotate(${body.angle}rad)`;
        });
        rafRef.current = requestAnimationFrame(updatePositions);
      }
      updatePositions();

      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('touchstart', touchStartHandler);
        container.removeEventListener('touchmove', touchMoveHandler);
        container.removeEventListener('touchend', touchEndHandler);
      };
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      if (localCleanUp) localCleanUp();
    };
  }, [isClient]);

  return (
    <div className="page-section" id="skills">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Skills & tools"
          title="Tools I reach for."
          body="Specialized in visual communication, branding, and digital design—combining artistic instinct with industry-standard design tools."
        />
      </ScrollReveal>

      {!isClient ? (
        <ScrollReveal className="skills-wrap">
          {SKILLS_LIST.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </ScrollReveal>
      ) : (
        <div
          ref={containerRef}
          className="skills-physics-container"
        >
          {/* Shuffle button — top-left */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => { e.stopPropagation(); }}
            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); handleShuffle(); }}
            onClick={(e) => { e.stopPropagation(); handleShuffle(); }}
            className="skills-shuffle-btn"
          >
            ↺ Shuffle
          </button>

          {/* Drag tip — top-right, not selectable */}
          <div className="skills-drag-tip">
            Drag to toss
          </div>

          {SKILLS_LIST.map((skill) => (
            <div
              key={skill}
              className="skill-physics-tag"
            >
              {skill}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
