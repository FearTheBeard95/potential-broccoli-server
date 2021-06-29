function fetchPhotos() {
    let dataGallery = {}
    fetch('/photos').then((response) => {
        response.json().then((data) => {
            const html = data.photos.map((photo) => {
                return `<div class="col-lg-4 col-md-6 portfolio-item filter-app">
                            <div class="portfolio-wrap">
                            <img src="/photos/${photo._id}" class="img-fluid" alt="">
                            <div class="portfolio-info">
                                <div class="portfolio-links">
                                <a href="/photos/${photo._id}" data-gallery="portfolioGallery" class="portfokio-lightbox" title="App 1"><i class="bi bi-zoom-in"></i></a>
                                </div>
                            </div>
                            </div>
                        </div>`
            })
            .join("")
            document.querySelector('#portfolio').insertAdjacentHTML("beforeend",`<div class="row gy-4 portfolio-container" data-aos="fade-up" data-aos-delay="200">`+html+`</div>`)
        })
    })
}

                
      
              