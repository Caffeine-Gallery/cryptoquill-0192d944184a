import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const newPostBtn = document.getElementById('newPostBtn');
    const postForm = document.getElementById('postForm');
    const blogPostForm = document.getElementById('blogPostForm');
    const postsSection = document.getElementById('posts');

    newPostBtn.addEventListener('click', () => {
        postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    });

    blogPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const body = quill.root.innerHTML;

        try {
            await backend.createPost(title, body, author);
            blogPostForm.reset();
            quill.setContents([]);
            postForm.style.display = 'none';
            fetchAndDisplayPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    });

    async function fetchAndDisplayPosts() {
        try {
            const posts = await backend.getPosts();
            postsSection.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p class="author">By ${post.author}</p>
                    <div class="post-content">${post.body}</div>
                    <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
                `;
                postsSection.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    fetchAndDisplayPosts();
});
