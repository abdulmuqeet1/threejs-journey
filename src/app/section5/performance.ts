// performance
// lecture# 30

// 1. monitor both cpu and gpu performance

// 2. try to maintain at least 60fps

// 3. monitoring draw calls
//    draw calls are action of drawing by gpu
//    the less draw calls you have, the better
//    (use specter.js extension for draw calls)

// 4. dispose once you dont need a resource(like geometry, mesh, material lights etc)
//    dont just leave the resources there when u dont need them
// !  https://threejs.org/docs/index.html?q=dispose#manual/en/introduction/How-to-dispose-of-objects
//    e.g
//    scene.remove(someMesh); // also

// 5. if possible, build model/scene without lights
//    avoid threejs lights
//    if you need lights, use baked lights or cheap lights(like ambient light directLight, hemisphereLight)
//    avoid adding or removing lights => when adding or removing lights, all the light supported material get recompiled

// 6. Avoid threejs shadow
//    use baked shadows

// 7. optimize shadow maps
//    use castShadow and receive shadow WISELY

// 8. resize texture
//    textures take a lot of space in the gpu memory especially with the mipmaps
//    te texture file weight has nothing to do with that, and only the resolution of the matters
//    try to reduce the resolution to the minimum while keeping  decent results
//    keep a power of 2 resolution(is u dont do this threejs will try to fix it, hence using more resources)
//    use the right format can reduce the loading time
//    reduce weight of images(while keeping decent resolution)

// 9. Geometry
//    use buffer geometry(it better for performance then normal ones)
//    avoid updating vertices(to often, try avoiding it)
//    merge geometries(use bufferGeometryUtils)

// 10. Material
//     mutualize material => if u r using the same material in multiple objects, crete only once and use it multiple times(by using loops)
//     use cheap material => like meshStandardMaterial or MeshPhysicalMaterial need more resources
//     use instancedMesh =>
//     use low poly model
//     use draco compression
//     GZIP => activate gzip on the server

// 11. Camera
//     => when objects are not in the field of view, they wont be rendered(frustum culling)
//     that can seem like a tawdry solution, but you can reduce the camera's field of view(depending on the scene/objects)

// 11. Renderer
//     Pixel Ratio => dont use default pixel ratio(some device have high pixel ratio)
//     anti alias =>  use when needed
//     Post Processing =>  use less passes. if u have multiple passes, try merging them into one

// 12. Shaders
//     => you can force the precision of the shaders in the materials by changing their precision property
//     e.g. precision: 'lowp'
//     => keep your code simple
//     => avoid if statement
//     => use textures(instead of peri noise in shaders)
//     => uniforms(in shaders) are beneficial because they can be tweaked, however if value isnt changing use define(uniform has performance cost)
//     => do the calculations in the vertex shaders (and then send results to the fragment shaders)

// 13. Keep an EYE on the performance from the start
//     => also fix any weird behavior from the start

// Read Article => // ! https://discoverthreejs.com/tips-and-tricks/
