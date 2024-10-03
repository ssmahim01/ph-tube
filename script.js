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

/* Create Load Videos */

const loadVideos = (searchText = "") => {
   fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
   .then(response => response.json())
   .then(data => displayVideos(data.videos))
   .catch(error => console.log(error))
};

/* Create Load Category Videos */

const loadCategoryVideos = (id) => {
   fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
   .then(response => response.json())
   .then(data => {

      removeActiveBtn();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add('active-btn');
      displayVideos(data.category);
   })
   .catch(error => console.log(error))
};

/* Create Load Details */

const loadDetails = async(videoId) => {
   const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
   const response = await fetch(url);
   const data = await response.json();
   displayDetails(data.video);
};

/* Create Display Details */

const displayDetails = (video) => {
   const modalContent = document.getElementById('modal-content');

   modalContent.innerHTML = `
   <div class="space-y-4 pb-5">
   <img class="w-full h-full object-cover rounded-lg" src="${video.thumbnail}"/>
   <p class="text-gray-600 font-semibold">${video.description}</p>
   </div>
   `
   document.getElementById('customModal').showModal();
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
      <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn btn-category">${item.category}</button>
      `;
       categoryContainer.append(div);
    });
};

/* Create Display Videos */

const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos');
    videosContainer.innerHTML = "";

    if(videos.length == 0){
      videosContainer.classList.remove('grid');
      videosContainer.innerHTML = `
      <div class="min-h-[250px] flex flex-col justify-center items-center gap-5">
      <img src="assets/Icon.png"/>
      
      <h2 class="text-center text-xl font-bold">No Content Here in this Category</h2>
      </div>
      `;
      return;
    }
    else{
      videosContainer.classList.add('grid');
    }

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
        <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error text-white mt-2">Details</button></p>
        </div>
        </div>
     </div>
       `
       videosContainer.append(card);
    });
};

/* Remove Active Buttons */

const removeActiveBtn = () => {
   const buttons = document.getElementsByClassName('btn-category');
   for(let btn of buttons){
      btn.classList.remove('active-btn');
   }
};

document.getElementById('search-input').addEventListener('keyup', (event) => {
   loadVideos(event.target.value);
});

loadCategories();
loadVideos();