import { fetchData } from "../../scripts/utils.js"
import { createOptimizedPicture } from '../../scripts/aem.js';


const createHtml = (response, obj) => {
  const div = document.createElement('section')
  const { title, description, json } = obj
  div.className = 'events'
  let cardSize = 6
  let cardHtml = `
    <div class="container">
        <div class="heading-block">
            <h2 class="heading">${title}</h2>
            <p>${description}</p>
        </div>
        <div class="row ${json === 'events' ? 'design1' : 'design2'}">`
  response?.data.forEach((ele, index) => {
    if (index === 0) cardSize = 6
    else cardSize = 3
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
    </div>`
  })
  cardHtml += `</div></div>
</section>`
  div.innerHTML = cardHtml
  return { div }
}

const updateConfig = (updatedObj) => {
  const oldConfig = document?.learningAcademy?.block.cardsBlock.config
  document.learningAcademy = {
    block: {
      cardsBlock: {
        config: {
          ...oldConfig,
          ...updatedObj
        }
      }
    }
  };
}

const handleClick = async (block, isNext) => {
  let { offset, limit, json } = document?.learningAcademy?.block.cardsBlock.config
  offset = isNext ? offset + limit : offset - limit
  console.log({
    limit: limit,
    offset
  })
  const response = await fetchData(json, {
    limit: limit,
    offset
  })
  updateConfig({ offset })
  console.log({ response, offset })
  const { div } = createHtml(response)
  const { paginationDiv } = createPaginationBlock(response, block)

  block.textContent = '';
  block.append(div);
  block.append(paginationDiv);
}

const createPaginationBlock = (response, block, obj) => {
  const paginationDiv = document.createElement('div')
  paginationDiv.className = 'pagination-block'
  const prevDiv = document.createElement('button')
  prevDiv.textContent = 'Previous'
  const nextDiv = document.createElement('button')
  nextDiv.textContent = 'Next'

  const { offset, limit, total } = response
  if (offset === 0) prevDiv.disabled = true;
  if (offset + limit >= total) nextDiv.disabled = true;

  // paginationDiv.append(prevDiv)
  // paginationDiv.append(nextDiv)

  nextDiv.addEventListener('click', async () => handleClick(block, true))
  prevDiv.addEventListener('click', async () => handleClick(block, false))

  return {
    paginationDiv,
    nextDiv,
    prevDiv
  }

}

export default async function decorate(block) {
  const obj = {
    title: '',
    description: '',
    json: '',
    designType: '',
    limit: 2,
    offset: 0
  };

  // [...block.children].forEach((row) => {
  //   [...row.children].forEach((col, colIndex) => {
  obj.title = block.children[0].children[0].innerText
  obj.description = block.children[1].children[0].innerText
  obj.json = block.children[2].children[0].innerText
  obj.limit = block.children[2].children[0].innerText === 'events' ? 3 : 4   // need to make dynamic
  obj.designType = block.children[2].children[0].innerText === 'events' ? 'design1' : 'design2'
  //   })
  // })
  if (!document?.learningAcademy?.block?.cardsBlock) {
    const cardsBlock = {}
    cardsBlock[obj.designType] = {
      config: {
        ...obj
      }
    }
    document.learningAcademy = {
      block: {
        cardsBlock
      }
    };
  } else {
    const cardsBlock = {}
    cardsBlock[obj.designType] = {
      config: {
        ...obj
      }
    }

    document.learningAcademy = {
      block: {
        cardsBlock : {
          ...document?.learningAcademy?.block?.cardsBlock,
          ...cardsBlock
        }
      }
    };
  }

  const response = await fetchData(obj.json, {
    limit: obj.limit,
    offset: obj.offset
  })
  const { div } = createHtml(response, obj)
  // pagination
  const { paginationDiv, nextDiv, prevDiv } = createPaginationBlock(response, block, obj)

  // nextDiv.addEventListener('click', async () => {
  //     console.log('clicked')
  //     const offset = obj.offset + obj.limit
  //     const response = await fetchData(obj.json, {
  //         limit: obj.limit,
  //         offset
  //     })

  //     const { div } = createHtml(response)
  //     const { paginationDiv} = createPaginationBlock(response)

  //     block.textContent = '';
  //     block.append(div);
  //     block.append(paginationDiv);
  // })




  block.textContent = '';
  div.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.append(div);
  // block.append(paginationDiv);

}