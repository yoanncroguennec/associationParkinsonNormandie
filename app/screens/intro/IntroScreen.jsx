"use client"

import React, { useMemo, useRef } from 'react'
import * as THREE from "three"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import { OrbitControls, shaderMaterial } from "@react-three/drei"
import { dataIntro } from "@/app/utils/constants/data/dataIntro"
import { Box, Typography } from "@mui/material"
import { Tubes } from "./brainTubes/BrainTubes"

const PATHS = dataIntro.economics[0].paths;
console.log(" :", dataIntro.economics[0].paths);

const randomRange = (min, max) => Math.random() * (max - min) + min

export default function IntroScreen() {
    let curves = []
    // Curves
    for (let i = 0; i < 100; i++) {
        let points = []
        let length = randomRange(0.1, 1)
        // Points
        for (let j = 0; j < 100; j++) {

            points.push(
                new THREE.Vector3().setFromSphericalCoords(
                    1,
                    Math.PI - (j / 100) * Math.PI * length,
                    (i / 100) * Math.PI * 2,
                )
            )

            let tempcurve = new THREE.CatmullRomCurve3(points)
            curves.push(tempcurve)
        }
    }
    // console.log("cuves :", curves);

    let brainCurves = []

    PATHS.forEach((path) => {
        let points = []
        for (let i = 0; i < path.length; i += 3) {
            points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]))
        }

        let tempcurve = new THREE.CatmullRomCurve3(points)
        brainCurves.push(tempcurve)
    })

    function BrainParticles({ allthecurves }) {
let positions = useMemo(() => {
    let positions = []
    for (let i = 0; i < 100; i++) {
        positions.push(
            randomRange(-1, 1),
            randomRange(-1, 1),
            randomRange(-1, 1),
        )
    }

    return new Float32Array(positions)
}, [])
        const BrainParticleMaterial = shaderMaterial(
            { time: 0, color: new THREE.Color(0.1, 0.3, 0.6)},
            // VerteX shader
            // glsl
            `
                    varying vec2 vUv;
                    uniform float time;
                    varying float vProgress;
    
                    void main(){
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = 5.0;
                    }
                `,
            // Fragment shader
            // glsl
            `
                    uniform float time;
    
                    void main(){
                        gl_FragColor = vec4(1., 0., 0., 1.);
                    }
                `,
        )

        // Declaratively
        extend({ BrainParticleMaterial })
        
        return (
            <>
                <points>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attachObject="attribute-position"
                            count={positions.length / 3}
                            array={positions}
                            itemSize={3}
                        />
                        {/* <BrainParticleMaterial attach="material" /> */}
                    </bufferGeometry>
                </points>
            </>
        )

    }

    return (
        <Box>
            <Box><Typography>La parkinson</Typography></Box>
            <Box>
                <Canvas camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }} style={{ height: "100vh", width: "100vw" }}>
                    <color attach="background" args={["black"]} />
                    <ambientLight />
                    <pointLight positition={[10, 10, 10]} />
                    <Tubes allthecurve={brainCurves} />
                     <BrainParticles allthecurves={brainCurves} />
                    <OrbitControls />
                </Canvas>
            </Box>
        </Box>
    )
}
