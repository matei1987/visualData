
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Visualizing Government Spending by State' });
};