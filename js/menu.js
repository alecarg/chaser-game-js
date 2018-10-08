menu.init = function(){
  menu.slide = 1;
  menu.bindEventHandlers();
}

menu.bindEventHandlers = function(){
  $('.next').on('click', this.nextSlide);
  $('.prev').on('click', this.prevSlide);
  $('.start').on('click', this.startGame);
}

menu.nextSlide = function(){
  $('.menu .bottom').animate({height: '100%'});
  $('.menu .top').animate({height: 0});
  $('.menu .slide-' + menu.slide).fadeOut(function(){
    menu.slide++;
    $('.menu .slide-' + menu.slide).fadeIn();
  })
}

menu.prevSlide = function(){
  $('.menu .bottom').animate({height: '100%'});
  $('.menu .top').animate({height: 0});
  $('.menu .slide-' + menu.slide).fadeOut(function(){
    menu.slide--;
    $('.menu .slide-' + menu.slide).fadeIn();
  })
}

menu.startGame = function(){
  $('.menu').fadeOut(function(){
    game.init();
  });
}