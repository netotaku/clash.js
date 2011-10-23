




var clash = {

	library: function(){
	
		this.images = [];
		this.onReady = function(){};
		
	},
						
	stage: function(id){
	
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext("2d");
		this.movieClips = {};
		this.frameRate = 22; // fps
		this.timeout = 0;
	
		this.nextFrame();
		
	},
	
	movieClip: function(){
	
		this._attachment = false;
		this._visible = true;
		this._level = 0; // not implemented yet
		this._height = 0;
		this._width = 0;
		this._color = false;
		this._x = 0;
		this._y = 0;
		this.playing = true;
		
		this.onEnterFrame = function(){};
		this.onLoad = function(){};
		
	}

}

////////////////////////////////////////////////////////////////////

clash.library.prototype.count = 0;

clash.library.prototype.get = function(name)
{

	for(var i = 0; i < this.images.length; i++) if(name == this.images[i].name) return this.images[i].data;
	
}

clash.library.prototype.countIn = function()
{

	if(++this.count <= this.images.length) this.onReady();
	
}

clash.library.prototype.attachImages = function(images)
{

	this.images = images;
	
	var lib = this;
	
	for(var i = 0; i < images.length; i++)
	{
		
		var image = new Image();
		image.onload = function(){
			lib.countIn();
		}

		image.onerror = function(){
			console.debug('oops: Problem loading image.');
		}

		image.src = images[i].src;												
		images[i].data = image;
			
	}
		

}

////////////////////////////////////////////////////////////////////

clash.stage.prototype.nextFrame = function() 
{
	
    var inst = this;
    
    this.timeout = setTimeout(function(){
	
		inst.onEnterFrame();

	}, 1000/this.frameRate);
	
}

clash.stage.prototype.duplicateMovieClip = function(name, mc, config)
{
	
	var duplicate = new clash.movieClip;
		
		for(prop in mc) duplicate[prop] = mc[prop];
		
		return this.attachMovieClip(name, duplicate, config);
		
}			

clash.stage.prototype.getNextHighestDepth = function()
{

	return this.movieClips.length;

}

clash.stage.prototype.clear = function()
{

	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

}

clash.stage.prototype.width = function()
{

	return this.canvas.width;

}

clash.stage.prototype.height = function()
{

	return this.canvas.height;

}			

clash.stage.prototype.onEnterFrame = function()
{
	
	this.clear();

	for(mc in this.movieClips)
	{
	
		var clip = this.movieClips[mc];	

		if(clip.playing) clip.onEnterFrame();			
		if(clip._visible) clip.render(this.context);
	
	}
	
	this.timeout = 0;						
	this.nextFrame();				

}

clash.stage.prototype.Xmouse = function()
{

	// not implemented yet ...  

}

clash.stage.prototype.Ymouse = function(){

	// not implemented yet ...

}

clash.stage.prototype.removeMoveClip = function(mc)
{

	if(typeof mc == 'string')
    {
        delete this.movieClips[mc];  
    }
    
    if(typeof mc == 'object')
    {
        for(m in this.movieClips)
        {
        
            if(m == mc) delete this.movieClips[m];
        
        }
    }
    

}

clash.stage.prototype.attachMovieClip = function(name, mc, config)
{
	
	if(typeof config == 'object') for(prop in config) mc[prop] = config[prop];

	mc.onLoad();

	if(mc._attachment != false)
	{

		mc._height = mc._attachment.height;		
		mc._width = mc._attachment.width;    

	}

    
	this.movieClips[name] = mc;
	
	return mc;

}

////////////////////////////////////////////////////////////////////

clash.movieClip.prototype.stop = function()
{

	this.playing = false;

}		

clash.movieClip.prototype.hitTest = function(mc)
{

	var hit = false;
	
	if(!(this._x > (mc._x + mc._width) || (this._x + this._width) < mc._x) && !(this._y > (mc._y + mc._height) || (this._y + this._height) < mc._y)) hit = true;
	
	return hit;

}			

clash.movieClip.prototype.play = function()
{

	this.playing = true;

}

clash.movieClip.prototype.render = function(context)
{
	
	if(this._attachment)
	{
	
		context.drawImage(this._attachment, this._x, this._y);
	
	} else {

		context.fillStyle = this._color;
		context.fillRect(this._x, this._y, this._width, this._height);
	}
	
}