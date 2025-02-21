import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function SuikaGame() {
  const sceneRef = useRef(null);
  const [engine] = useState(Matter.Engine.create()); // 物理エンジンのインスタンスを作成
  const [world] = useState(engine.world); // エンジンからワールドを取得
  const [bodies, setBodies] = useState([]); // 生成されたオブジェクトを管理するステート

  useEffect(() => {
    const Runner     = Matter.Runner;
    const render = Matter.Render.create({
      element: sceneRef.current, // レンダリング先のDOM要素
      engine: engine, // 使用する物理エンジン
      options: {
        width: 400, // ゲーム画面の幅
        height: 600, // ゲーム画面の高さ
        wireframes: false, // ワイヤーフレームモードをオフ
        background: '#f0f0f0' // 背景色
      }
    });

    // 床の作成
    const ground = Matter.Bodies.rectangle(200, 590, 400, 20, { isStatic: true });
    Matter.World.add(world, ground);

    // 物理エンジンとレンダリングの開始
    //Matter.Engine.run(engine);
    //Matter.Render.run(render);
    Matter.Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);


    // クリーンアップ処理
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine, world]);

  // ランダムな形状のオブジェクトを生成する関数
  const addShape = () => {
    const shapeType = Math.floor(Math.random() * 3); // 0: 丸, 1: 四角, 2: 三角
    let shape;

    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

    if (shapeType === 0) {
      // 丸
      const radius = 20 + Math.random() * 20;
      shape = Matter.Bodies.circle(200, 0, radius, {
        restitution: 0.5,
        render: { fillStyle: color }
      });
    } else if (shapeType === 1) {
      // 四角
      const size = 30 + Math.random() * 30;
      shape = Matter.Bodies.rectangle(200, 0, size, size, {
        restitution: 0.5,
        render: { fillStyle: color }
      });
    } else {
      // 三角
      const size = 40 + Math.random() * 20;
      shape = Matter.Bodies.polygon(200, 0, 3, size, {
        restitution: 0.5,
        render: { fillStyle: color }
      });
    }

    Matter.World.add(world, shape);
    setBodies(prevBodies => [...prevBodies, shape]);
  };

  return (
    <div>
      <h1>スイカゲーム</h1>
      <button onClick={addShape}>オブジェクトを追加</button>
      <div ref={sceneRef} />
    </div>
  );
}
