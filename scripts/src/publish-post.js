require('dotenv').config()

const Fs = require('fs')
const Path = require('path')
const { GraphQLClient } = require('graphql-request')

const client = new GraphQLClient('https://gql.hashnode.com', {
  headers: {
    Authorization: process.env.HASHNODE_API_KEY
  }
})

const query = Fs.readFileSync(
  Path.join(__dirname, 'upload.mutation.gql'),
  'utf-8'
)

const publishPost = (post) => {
  const variables = {
    input: {
      title: post.title,
      publicationId: process.env.HASHNODE_PUBLICATION_ID,
      contentMarkdown: post.content,
      publishedAt: post.date,
      slug: post.slug,
      originalArticleURL: post.url,
      settings: {
        delisted: true
      }
    }
  }

  return client.request(query, variables)
    .then((data) => {
      console.log('✅ Success!')
      console.log(data)
      return post.title
    })
    .catch((err) => {
      console.error('🚨 Error!')
      console.error(err)
    });
};


module.exports = publishPost;


if (process.env.TEST_PUBLISH) {
  const testPost = {
  }

  publishPost(testPost)
}
