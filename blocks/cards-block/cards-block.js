import fetchData from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const createHtml = (response, obj) => {
  const div = document.createElement('section');
  const { title, description, json } = obj;
  div.className = 'events';
  let cardSize = 6;
  let cardHtml = `
    <div class="container">
        <div class="heading-block">
            <h2 class="heading">${title}</h2>
            <p>${description}</p>
        </div>
        <div class="row ${json === 'events' ? 'design1' : 'design2'}">`;
  response?.data.forEach((ele, index) => {
    if (index === 0) cardSize = 6;
    else cardSize = 3;
    cardHtml += `<div class="${(cardSize === 6) ? 'col-6' : 'col-3'}">
        <figure class="card card-events ${(cardSize === 6) ? 'primary' : ''}">
            <div class="image-block"><img src="${ele.image}" alt="" /></div>
            <figcaption class="description">
                <h5 class="title">${ele.title}</h5>
                <ul>
                    <li><i class="icon icon-calender"></i> ${ele.date}</li>
                    <li><i class="icon icon-pin"></i>${ele.location}</li>
                    <li><i class="icon icon-clock"></i>${ele.time}</li>
                </ul>
                <div class="flex justify-between align-center">
                    <label class="tag">Virtual</label>
                    <button class="btn btn-primary" type="button">Register</button>
                </div>
            </figcaption>
        </figure>
    </div>`;
  });
  cardHtml += `</div></div>
</section>`;
  div.innerHTML = cardHtml;
  return { div };
};

export default async function decorate(block) {
  const obj = {
    title: '',
    description: '',
    json: '',
    designType: '',
    limit: 2,
    offset: 0,
  };

  // [...block.children].forEach((row) => {
  //   [...row.children].forEach((col, colIndex) => {
  obj.title = block.children[0].children[0].innerText;
  obj.description = block.children[1].children[0].innerText;
  obj.json = block.children[2].children[0].innerText;
  obj.limit = block.children[2].children[0].innerText === 'events' ? 3 : 4; // need to make dynamic
  obj.designType = block.children[2].children[0].innerText === 'events' ? 'design1' : 'design2';
  //   })
  // })
  if (!document?.learningAcademy?.block?.cardsBlock) {
    const cardsBlock = {};
    cardsBlock[obj.designType] = {
      config: {
        ...obj,
      },
    };
    document.learningAcademy = {
      block: {
        cardsBlock,
      },
    };
  } else {
    const cardsBlock = {};
    cardsBlock[obj.designType] = {
      config: {
        ...obj,
      },
    };

    document.learningAcademy = {
      block: {
        cardsBlock: {
          ...document?.learningAcademy?.block?.cardsBlock,
          ...cardsBlock,
        },
      },
    };
  }

  const response = await fetchData(obj.json, {
    limit: obj.limit,
    offset: obj.offset,
  });
  const { div } = createHtml(response, obj);
  block.textContent = '';
  div.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.append(div);
}
