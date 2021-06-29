function fetchData(type) {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const pageNumber = parseInt(page) || 0
    fetch(`/documents?type=${type}&skip=${pageNumber*4}`).then((response) => {
        response.json().then((data) => {
            const html = data.documents.map((doc) => {
                return `<article class="entry">

                            <h2 class="entry-title">
                                <a href="blog-single.html">${doc.title}</a>
                            </h2>
                        
                            <div class="entry-meta">
                                <ul>
                                    <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a href="blog-single.html"><time
                                                datetime="2020-01-01">${doc.createdAt}</time></a>
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="entry-content">
                                <p>
                                ${doc.abstract}
                                </p>
                                <div class="read-more">
                                    <a href="/document/file/${doc._id}">Read More</a>
                                </div>
                            </div>
            
                    </article>`
            })
            .join("")

            let pagination = []
            for (let i = 0; i < Math.round(data.count/4); i++) {
                pagination.push(`<li><a href="/researchreports?page=${i}">${i+1}</a></li>`)
            }
            const paginationHTML = pagination.join("")
            console.log(paginationHTML)
            document.querySelector('#pages').innerHTML = paginationHTML
            document.querySelector('#documents').insertAdjacentHTML("afterbegin",html)
        })
    })
}

function search(term, type) {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const pageNumber = parseInt(page) || 0
    fetch(`/search?type=${type}&term=${term}&skip=${pageNumber*4}`).then((response) => {
        response.json().then((data) => {
            const html = data.documents.map((doc) => {
                return `<article class="entry">

                            <h2 class="entry-title">
                                <a href="blog-single.html">${doc.title}</a>
                            </h2>
                        
                            <div class="entry-meta">
                                <ul>
                                    <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a href="blog-single.html"><time
                                                datetime="2020-01-01">${doc.createdAt}</time></a>
                                    </li>
                                </ul>
                            </div>
                        
                            <div class="entry-content">
                                <p>
                                ${doc.abstract}
                                </p>
                                <div class="read-more">
                                    <a href="/document/file/${doc._id}">Read More</a>
                                </div>
                            </div>
            
                    </article>`
            })
            .join("")

            let pagination = []
            for (let i = 0; i < Math.round(data.count/4); i++) {
                pagination.push(`<li><a href="/researchreports?page=${i}">${i+1}</a></li>`)
            }
            const paginationHTML = pagination.join("")
            console.log(paginationHTML)
            document.querySelector('#pages').innerHTML = paginationHTML
            document.querySelector('#documents').insertAdjacentHTML("afterbegin",html)
        })
    })
}