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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      Matter.Body.setAngle(body, 0); // start horizontal

      if ((body as any).isSleeping) {
        Matter.Sleeping.set(body, false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let localCleanUp: (() => void) | undefined;
    let initialized = false;

    const startPhysics = () => {
      if (initialized) return;
      const container = containerRef.current;
      if (!container) return;
      initialized = true;
      localCleanUp = initPhysics(container);
    };

    // 1. Immediate check if already visible or nearly visible
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        startPhysics();
      }
    }

    // 2. IntersectionObserver trigger for guaranteed activation
    let observer: IntersectionObserver | null = null;
    if (!initialized && container && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            startPhysics();
            if (observer) {
              observer.disconnect();
              observer = null;
            }
          }
        },
        { rootMargin: '100px 0px' }
      );
      observer.observe(container);
    }

    // 3. GSAP ScrollTrigger backup
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        if (container && !initialized) {
          ScrollTrigger.create({
            trigger: container,
            start: 'top bottom-=50px',
            onEnter: () => {
              startPhysics();
            },
            once: true,
          });
        }
      }
    );

    function initPhysics(cont: HTMLDivElement) {
      const { Engine, World, Bodies, Mouse, MouseConstraint, Runner, Events } = Matter;

      const eng = Engine.create({ constraintIterations: 4, positionIterations: 8, velocityIterations: 8 });
      eng.gravity.y = 1.0;
      engineRef.current = eng;

      const cr = cont.getBoundingClientRect();
      const W = cr.width || 800;
      const H = cr.height || 420;
      const T = 100;

      const bottomWall = Bodies.rectangle(W / 2, H + T / 2, W, T, { isStatic: true });
      const leftWall = Bodies.rectangle(-T / 2, H / 2 - 500, T, H + 1000, { isStatic: true });
      const rightWall = Bodies.rectangle(W + T / 2, H / 2 - 500, T, H + 1000, { isStatic: true });
      wallsRef.current = { bottom: bottomWall, left: leftWall, right: rightWall };
      World.add(eng.world, [bottomWall, leftWall, rightWall]);

      const elements = cont.querySelectorAll<HTMLDivElement>('.skill-physics-tag');
      const bodies: PhysicsBody[] = [];

      elements.forEach((el) => {
        el.style.opacity = '1';
        const rect = el.getBoundingClientRect();
        const elW = rect.width || 120;
        const elH = rect.height || 44;

        const rx = Math.random() * (W - elW) + elW / 2;
        const ry = -(Math.random() * 280 + elH);

        const body = Bodies.rectangle(rx, ry, elW, elH, {
          restitution: 0.45,
          friction: 0.04,
          frictionAir: 0.018,
          density: 0.001,
          angle: 0,
        });

        bodies.push({ body, element: el, width: elW, height: elH });
        World.add(eng.world, body);
      });

      bodiesRef.current = bodies;

      const mouse = Mouse.create(cont);
      (mouse as any).element.removeEventListener('mousewheel', (mouse as any).mousewheel);
      (mouse as any).element.removeEventListener('touchstart', (mouse as any).mousedown);
      (mouse as any).element.removeEventListener('touchmove', (mouse as any).mousemove);
      (mouse as any).element.removeEventListener('touchend', (mouse as any).mouseup);

      let isDraggingTag = false;

      const touchStartHandler = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const isTag = target.closest('.skill-physics-tag');

        if (isTag) {
          isDraggingTag = true;
          e.preventDefault();
        } else {
          isDraggingTag = false;
        }

        const touch = e.changedTouches[0];
        const rect = cont.getBoundingClientRect();
        mouse.position.x = touch.clientX - rect.left;
        mouse.position.y = touch.clientY - rect.top;
        (mouse as any).button = 0;
      };
      const touchMoveHandler = (e: TouchEvent) => {
        if (isDraggingTag) {
          e.preventDefault();
        }
        const touch = e.changedTouches[0];
        const rect = cont.getBoundingClientRect();
        mouse.position.x = touch.clientX - rect.left;
        mouse.position.y = touch.clientY - rect.top;
      };
      const touchEndHandler = () => {
        (mouse as any).button = -1;
        isDraggingTag = false;
      };
      cont.addEventListener('touchstart', touchStartHandler, { passive: false });
      cont.addEventListener('touchmove', touchMoveHandler, { passive: false });
      cont.addEventListener('touchend', touchEndHandler, { passive: true });

      const mc = MouseConstraint.create(eng, {
        mouse,
        constraint: { stiffness: 0.12, render: { visible: false } },
      });

      Events.on(mc, 'enddrag', (evt: any) => {
        const b: Matter.Body = evt.body;
        if (b) {
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
        const nr = cont.getBoundingClientRect();
        const nW = nr.width;
        const nH = nr.height;
        Matter.Body.setPosition(bottomWall, { x: nW / 2, y: nH + T / 2 });
        Matter.Body.setPosition(leftWall, { x: -T / 2, y: nH / 2 - 500 });
        Matter.Body.setPosition(rightWall, { x: nW + T / 2, y: nH / 2 - 500 });
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('resize', handleResize);
      World.add(eng.world, mc);

      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, eng);

      function updatePositions() {
        const nr = cont.getBoundingClientRect();
        const cW = nr.width;
        const cH = nr.height;
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
        cont.removeEventListener('touchstart', touchStartHandler);
        cont.removeEventListener('touchmove', touchMoveHandler);
        cont.removeEventListener('touchend', touchEndHandler);
      };
    }

    return () => {
      if (observer) observer.disconnect();
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
          body="Specialized in visual communication, branding, and digital design by combining artistic instinct with industry-standard design tools."
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

          {/* Drag tip — top-right */}
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
