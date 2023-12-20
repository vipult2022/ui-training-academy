import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) { 
    const parentDiv = document.createElement('div');
    parentDiv.className = 'hero-main';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'banner-content';

    [...block.children].forEach((row, index) => {
        const anchor = document.createElement('a');
        [...row.children].forEach((col, colIndex) => {
            const picture = col.querySelector('picture');
            if(picture) parentDiv.appendChild(picture)
            if(index === 1) {
                const heading = document.createElement('h1')
                heading.innerText = col.innerText
                contentDiv.appendChild(heading)
            }
            if(index === 2) {
                const desc = document.createElement('p')
                desc.innerText = col.innerText
                contentDiv.appendChild(desc)
            }
            if(index === 3) {
                if(colIndex === 1){
                    anchor.href = col.innerText
                    contentDiv.appendChild(anchor)
                } else {
                    anchor.innerText = col.innerText
                }
            }
        });
    });
    parentDiv.appendChild(contentDiv)

    block.textContent = '';
    block.append(parentDiv);
}
