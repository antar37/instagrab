const getUsername = (username = "instagram", imagesToGet = 12, idToFill = "instaGallery") => {
   const nameQuery = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${username}`;
   fetch(nameQuery, {mode: 'no-cors'})
   .then(response => response.json())
   .then(data => {
     const userFilter = data.users.filter((u) => u.user.username === username);
     const userObj = userFilter[0].user;
     profileQuery = `https://www.instagram.com/graphql/query/?query_hash=003056d32c2554def87228bc3fd9668a&variables={"id":${userObj.pk},"first":${imagesToGet}}`;

      fetch(profileQuery)
      .then(response => response.json())
      .then(data => {
         const images = data.data.user.edge_owner_to_timeline_media.edges.map((e) => ({
            likes: e.node.edge_media_preview_like.count,
            image: e.node.display_url,
            link: `https://www.instagram.com/${e.node.owner.username}/p/${e.node.shortcode}`,
            dimensions: e.node.dimensions,
            thumbnail: e.node.thumbnail_src,
            caption: e.node.edge_media_to_caption.edges[0].node.text,
            timestamp: e.node.taken_at_timestamp,
            taken_time: new Date(e.node.taken_at_timestamp * 1000)
         })
         );
         let instaGallery = document.getElementById(idToFill);
         images.forEach(image => {
            const wrapperEl = document.createElement("div");
            const linkEl = document.createElement("a")
            const imageEl = document.createElement("img");

            imageEl.classList.add("postimage");
            linkEl.classList.add("postlink")
            wrapperEl.classList.add("postwrapper")
            
            imageEl.src = image.thumbnail;
            linkEl.href = image.link;
            linkEl.target = "_blank"
            imageEl.title = `${image.caption} \n ${image.taken_time.toLocaleDateString("en-US")}`;   
            linkEl.appendChild(imageEl);
            wrapperEl.appendChild(linkEl);
            instaGallery.appendChild(wrapperEl);
         });
      });
   });
}

getUsername();