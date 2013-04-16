
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.session.loggedin) {
    res.redirect('/home');
  }
  else {
    res.render('index', { title: '' });
  }
};