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
                    <div class="comments">
                        <h3>Comments</h3>
                        <div class="comment-list" id="comments-${post.id}"></div>
                        <form class="comment-form" data-post-id="${post.id}">
                            <input type="text" placeholder="Your name" required>
                            <textarea placeholder="Your comment" required></textarea>
                            <button type="submit">Add Comment</button>
                        </form>
                    </div>
                `;
                postsSection.appendChild(postElement);
                fetchAndDisplayComments(post.id);
            });

            // Add event listeners for comment forms
            document.querySelectorAll('.comment-form').forEach(form => {
                form.addEventListener('submit', handleCommentSubmit);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    async function fetchAndDisplayComments(postId) {
        try {
            const comments = await backend.getComments(postId);
            const commentList = document.getElementById(`comments-${postId}`);
            commentList.innerHTML = '';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <p><strong>${comment.author}</strong>: ${comment.content}</p>
                    <p class="timestamp">${new Date(Number(comment.timestamp) / 1000000).toLocaleString()}</p>
                `;
                commentList.appendChild(commentElement);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const postId = Number(form.dataset.postId);
        const author = form.querySelector('input').value;
        const content = form.querySelector('textarea').value;

        try {
            await backend.addComment(postId, author, content);
            form.reset();
            fetchAndDisplayComments(postId);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    fetchAndDisplayPosts();
});
