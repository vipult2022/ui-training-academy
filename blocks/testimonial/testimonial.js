
export default function decorate(block) { console.log('vv')
    const blockName = 'vt-testimonial';
    const mainBlock = document.createElement('div');
    // mainBlock.className = `${blockName}-block`;
    // const contentBlock = document.createElement('div');
    // contentBlock.className = `${blockName}-content`;
    // const TagBlock = document.createElement('span');
    // contentBlock.className = 'tag-line';
    // const h2 = document.createElement('h2');
    // contentBlock.className = 'content-title';
    // const desc = document.createElement('p');
    // contentBlock.className = 'content-description';
    const picture = block.querySelector('picture');
    const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const ctaButtons = block.querySelectorAll('.button-container a');
    const contentWrapper = block.querySelector(':scope > div');
    const content = block.querySelector(':scope > div > div');

    contentWrapper.classList.add(`${blockName}__content-wrapper`);
    content.classList.add(`${blockName}__content`);
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__heading`));
    [...ctaButtons].forEach((button) => {
        button.classList.add(`${blockName}__button`, 'tertiary', 'dark');
        button.classList.remove('primary');
    });

    const pictureTag = picture;
    pictureTag.classList.add(`${blockName}__bg-image`)
    picture.remove();

    block.prepend(pictureTag);
    console.log({picture, contentWrapper, content, headings,ctaButtons});

    // [...block.children].forEach((row) => {
    //     // if(row.children)
    //     [...row.children].forEach((col, colIndex) => {
    //         const picture = col.querySelector('picture');
    //         if(picture) mainBlock.appendChild(picture)
    //         else {
    //             // contentBlock.append(col)
    //             console.log("vv",{col});
    //         }
    //     })
    // });

    // block.textContent = '';
    // block.appendChild(mainBlock)
}