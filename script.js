/* Get string of time */

function getTimeString(time){
   const hour = parseInt(time / 3600);
   let remainingSec = time % 3600;

   const minute = parseInt(remainingSec / 60);
   remainingSec = remainingSec % 60;
   return `${hour} hour ${minute} minute ${remainingSec} second ago`; 
};

/* Create Load Categories */

const loadCategories = () => {
   fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
   .then(response => response.json())
   .then(data => displayCategories(data.categories))
   .catch(error => console.log(error))
};

const loadVideos = () => {
   fetch('https://openapi.programming-hero.com/api/phero-tube/videos')
   .then(response => response.json())
   .then(data => displayVideos(data.videos))
   .catch(error => console.log(error))
};

const loadCategoryVideos = (id) => {
   fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
   .then(response => response.json())
   .then(data => displayVideos(data.category))
   .catch(error => console.log(error))
};

/* Create Display Categories */

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container');

    categories.forEach((item) => {
       const button = document.createElement('button');
       button.classList = 'btn';
       button.innerText = item.category;
      const div = document.createElement('div');
      div.innerHTML = `
      <button onclick="loadCategoryVideos(${item.category_id})" class="btn">${item.category}</button>
      `;
       categoryContainer.append(div);
    });
};

const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos');
    videosContainer.innerHTML = "";

    videos.forEach((video) => {
       const card = document.createElement('div');
       card.classList = "card card-compact";
       card.innerHTML = `
        <figure class="h-[200px] relative">
        <img class="w-full h-full object-cover"
        src=${video.thumbnail} />
        ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black rounded text-white text-xs p-1">${getTimeString(video.others.posted_date)}</span>`}
        </figure>
        <div class="flex gap-2 px-0 py-2">
        <div>
        <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} />
        </div>
        <div>
        <h2 class="font-bold">${video.title}</h2>
        <div class="flex items-center gap-2">
        <p class="text-gray-400 font-medium">${video.authors[0].profile_name}</p>
        ${video.authors[0].verified == true? `<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>`:""}
        </div>
        </div>
        </div>
     </div>
       `

       videosContainer.append(card);
    });
}

loadCategories();
loadVideos();