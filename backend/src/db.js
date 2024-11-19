async function getPosts(db) {
  const posts = await db.allP(`
    SELECT 
      post.id AS post_id,
      post.title AS post_title,
      post.content AS post_content,
      post.attachment AS post_attachment,
      post.creation_date AS post_creation_date,
      post.last_change_date AS post_last_change_date,
      user.id AS user_id,
      user.name AS user_name
    FROM 
      post
    JOIN
      user ON post.user_id = user.id
  `);

  for(const post of posts){
    const postId = post.post_id;
    const comments = await db.allP(`
      SELECT 
        comment.id AS comment_id,
        comment.content AS comment_content,
        comment.creation_date AS comment_creation_date,
        comment.last_change_date AS comment_last_change_date,
        user.id AS user_id,
        user.name AS user_name
      FROM 
        comment
      JOIN
        user ON comment.user_id = user.id
      WHERE
       comment.post_id = ${postId}
    `);
    post.comments = comments;
  }

  return posts;
}

export default getPosts;
