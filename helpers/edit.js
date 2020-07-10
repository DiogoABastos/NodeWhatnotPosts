module.exports = {
  editIcon: function(postUser, loginUser, postId, floating = true) {
    if (postUser._id.toString() == loginUser._id.toString()) {

      if (floating) {
        return `<a href="/posts/edit/${postId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/posts/edit/${postId}"><i class="fas fa-edit"></i></a>`
      }

    } else {
      return '';
    }
  },

  showName: function (name, post) {
    if (name) {
      return `${post.user.firstName}'s`;
    } else {
      return '';
    }
  }
}
