from setuptools import setup

setup(
 	name = 'macaron',
     version = '0.1.0',
     url = 'https://github.com/t-ryo/macaron.git@server',
     license = 'KuramitsuLab',
     author = 't-ryo',
     description = 'hoge',
     install_requires = ['setuptools', 'flask'],
 	packages = ['macaron', 'macaron.src'],
 	package_data = {'macaron': ['examples/*.macaron'],
 	'macaron.src': [ 'static/addon/hint/show-hint.*',
 	'static/css/*.css', 'static/css/codemirror/*.css',
 	'static/image/*.png',
 	'static/js/codemirror/*.js', 'static/js/drawer/*.js', 'static/js/matter/*.js', 'static/js/mode/javascript/*.js', 'static/js/mode/macaron/*.js', 'static/js/parser/*.js', 'static/js/*.js',
 	'static/opeg/*.opeg',
 	'templates/*.html']},
 	entry_points = {
 		'console_scripts': [
 			'macaron = macaron.src.server:main'
 		]
 	},
)