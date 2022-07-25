import * as THREE from 'three';

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (): void => {
    console.log(`Started loading file...`);
};

loadingManager.onProgress = (
    url: string,
    loaded: number,
    total: number,
): void => {
    console.log(
        `Started loading file: ${url}`,
        '/n',
        `${loaded} of ${total} loaded`,
    );
};

loadingManager.onLoad = (): void => {
    console.log('downloading file(s) complete!');
};

export default loadingManager;
