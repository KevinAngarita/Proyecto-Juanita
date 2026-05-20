import * as THREE from 'three'

import { GLTFLoader }
from 'three/examples/jsm/loaders/GLTFLoader.js'

import gsap from 'gsap'

import { ScrollTrigger }
from 'gsap/ScrollTrigger'

gsap.registerPlugin(
    ScrollTrigger
)

// ================= SCENE =================

const scene =
new THREE.Scene()

scene.background =
new THREE.Color('#F5EFE6')

// ================= CAMERA =================

const camera =
new THREE.PerspectiveCamera(

    75,

    window.innerWidth /
    window.innerHeight,

    0.1,

    1000

)

camera.position.set(
    0,
    0.5,
    6
)

scene.add(camera)

// ================= RENDERER =================

const renderer =
new THREE.WebGLRenderer({

    antialias:true,

    alpha:true

})

renderer.setSize(
    window.innerWidth,
    window.innerHeight
)

renderer.setPixelRatio(
    window.devicePixelRatio
)

renderer.shadowMap.enabled = true

document.body.appendChild(
    renderer.domElement
)

// ================= LIGHTS =================

// Ambient Light

const ambientLight =
new THREE.AmbientLight(
    0xffffff,
    2
)

scene.add(ambientLight)

// Directional Light

const directionalLight =
new THREE.DirectionalLight(
    0xffd6a5,
    4
)

directionalLight.position.set(
    5,
    5,
    5
)

directionalLight.castShadow = true

scene.add(directionalLight)

// Point Light

const pointLight =
new THREE.PointLight(
    0xffb703,
    5,
    20
)

pointLight.position.set(
    0,
    2,
    3
)

scene.add(pointLight)

// ================= PARTICLES =================

const particlesGeometry =
new THREE.BufferGeometry()

const particlesCount = 1200

const positionArray =
new Float32Array(
    particlesCount * 3
)

for(
    let i = 0;
    i < particlesCount * 3;
    i++
){

    positionArray[i] =
    (Math.random() - 0.5) * 20

}

particlesGeometry.setAttribute(

    'position',

    new THREE.BufferAttribute(
        positionArray,
        3
    )

)

const particlesMaterial =
new THREE.PointsMaterial({

    size:0.03,

    color:'#A67C52'

})

const particles =
new THREE.Points(

    particlesGeometry,

    particlesMaterial

)

scene.add(particles)

// ================= MODEL =================

const loader =
new GLTFLoader()

let mixer = null

let model

loader.load(

    './models/coffee.glb',

    (gltf)=>{

        model = gltf.scene

        model.scale.set(
            0.05,
            0.05,
            0.05,
        )

        model.position.set(
            1,
            -1,
            1
        )

        // SHADOWS

        model.traverse((child)=>{

            if(child.isMesh){

                child.castShadow = true

                child.receiveShadow = true

            }

        })

        scene.add(model)

        // ================= MIXER =================

        mixer =
        new THREE.AnimationMixer(
            model
        )

        if(
            gltf.animations.length > 0
        ){

            const action =
            mixer.clipAction(
                gltf.animations[0]
            )

            action.play()

        }

        // ================= MODEL ROTATION =================

        gsap.to(

            model.rotation,

            {

                y: Math.PI * 2,

                ease:'power2.out',

                scrollTrigger:{

                    trigger:
                    '.services',

                    start:
                    'top bottom',

                    end:
                    'bottom top',

                    scrub:1.5

                }

            }

        )

        // ================= MODEL POSITION =================

        gsap.to(

            model.position,

            {

                x:1,

                ease:'power1.out',

                scrollTrigger:{

                    trigger:
                    '.experience',

                    start:
                    'top center',

                    end:
                    'bottom center',

                    scrub:2

                }

            }

        )

    }

)

// ================= HERO ANIMATION =================

gsap.from(

    '.hero .content',

    {

        opacity:0,

        y:100,

        duration:1.5,

        ease:'power3.out'

    }

)

// ================= SECTION ANIMATION =================

gsap.utils.toArray(
'.section'
).forEach((section)=>{

    const content =
    section.querySelector(
        '.content'
    )

    if(content){

        gsap.from(

            content,

            {

                opacity:0,

                y:80,

                duration:1.2,

                ease:'power2.out',

                scrollTrigger:{

                    trigger:section,

                    start:'top 75%',

                    end:'bottom 30%',

                    toggleActions:
                    'play none none reverse'

                }

            }

        )

    }

})

// ================= CAMERA SCROLL =================

gsap.to(

    camera.position,

    {

        z:5,

        y:1,

        ease:'power2.out',

        scrollTrigger:{

            trigger:
            '.about',

            start:
            'top bottom',

            end:
            'bottom top',

            scrub:2

        }

    }

)

// ================= LIGHT ANIMATION =================

gsap.to(

    directionalLight.position,

    {

        x:-2,

        y:4,

        z:3,

        ease:'sine.out',

        scrollTrigger:{

            trigger:
            '.gallery',

            start:
            'top bottom',

            end:
            'bottom top',

            scrub:2

        }

    }

)

// ================= RAYCASTER =================

const raycaster =
new THREE.Raycaster()

const mouse =
new THREE.Vector2()

window.addEventListener(

'mousemove',

(event)=>{

    mouse.x =
    (event.clientX /
    window.innerWidth)
    * 2 - 1

    mouse.y =
    -(event.clientY /
    window.innerHeight)
    * 2 + 1

}

)

// ================= CLICK EVENT =================

window.addEventListener(

'click',

()=>{

    if(model){

        gsap.to(

            model.rotation,

            {

                y:
                model.rotation.y
                +
                Math.PI / 2,

                duration:1.2,

                ease:'power2.out'

            }

        )

    }

}

)

// ================= CLOCK =================

const clock =
new THREE.Clock()

// ================= ANIMATION LOOP =================

function animate(){

    requestAnimationFrame(
        animate
    )

    const delta =
    clock.getDelta()

    // ================= MIXER =================

    if(mixer){

        mixer.update(delta)

    }

    // ================= MODEL =================

    if(model){

        // FLOAT EFFECT

        model.position.y =
        Math.sin(
            Date.now() * 0.001
        ) * 0.1 - 1.8

        // SMOOTH MOUSE FOLLOW

        model.rotation.y +=

        (
            mouse.x * 0.3
            -
            model.rotation.y
        )

        * 0.03

        model.rotation.x +=

        (
            -mouse.y * 0.15
            -
            model.rotation.x
        )

        * 0.03

    }

    // ================= PARTICLES =================

    particles.rotation.y +=
    0.0003

    // ================= RAYCASTER =================

    raycaster.setFromCamera(
        mouse,
        camera
    )

    const intersects =
    raycaster.intersectObjects(
        scene.children,
        true
    )

    // ================= HOVER EFFECT =================

    if(intersects.length > 0){

        document.body.style.cursor =
        'pointer'

        gsap.to(

            pointLight,

            {

                intensity:7,

                duration:0.5

            }

        )

    }
    else{

        document.body.style.cursor =
        'default'

        gsap.to(

            pointLight,

            {

                intensity:5,

                duration:0.5

            }

        )

    }

    // ================= CAMERA PARALLAX =================

    camera.position.x +=
    (
        mouse.x * 0.2
        -
        camera.position.x
    )
    * 0.02

    camera.lookAt(0,0,0)

    // ================= RENDER =================

    renderer.render(
        scene,
        camera
    )

}

animate()

// ================= RESPONSIVE =================

window.addEventListener(

'resize',

()=>{

    camera.aspect =
    window.innerWidth /
    window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    )

}

)