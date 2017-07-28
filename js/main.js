/*global THREE*/
$(function(){
	class Display{
		constructor(){
			let renderer = this.renderer = new THREE.CSS3DRenderer();
			this.scene = new THREE.Scene();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.domElement.id='display';
			this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
			this.camera.position.z = 425;
			this.slideMoving = false;
			this.pages = [];
			$('body').append(renderer.domElement);
		}
		addPage(page){
			let pageData = page.pageData;
			let object = new THREE.CSS3DObject(pageData.dom);
			object.position.copy(pageData.pos);
			object.rotation.x = pageData.rotation.x;
			object.rotation.y = pageData.rotation.y;
			object.rotation.z = pageData.rotation.z;
			this.pages.push(object);
			this.scene.add(object);
			this.renderer.render(this.scene, this.camera);
		}
		next(){
			if(this.slideMoving)return false;
			this.slideMoving = true;
			let self = this;
			let beforePoses = [];
			for (let i = 0; i < this.pages.length; i++) {
				beforePoses[i] = {};
				beforePoses[i].x = this.pages[i].position.x;
				beforePoses[i].y = this.pages[i].position.y;
				beforePoses[i].z = this.pages[i].position.z;
			}

			$({pagePosDelta:0, flontPagePosDelta:0}).animate({pagePosDelta:50, flontPagePosDelta:600}, {
				duration:500,
				progress:function(){
					for (let i = 0; i < self.pages.length; i++) {
						if(beforePoses[i].z > -50){
							self.pages[i].position.x = beforePoses[i].x - this.flontPagePosDelta;
							self.pages[i].position.y = beforePoses[i].y - this.flontPagePosDelta;
							self.pages[i].position.z = beforePoses[i].z + this.flontPagePosDelta;
						}else{
							self.pages[i].position.x = beforePoses[i].x - this.pagePosDelta;
							self.pages[i].position.y = beforePoses[i].y - this.pagePosDelta;
							self.pages[i].position.z = beforePoses[i].z + this.pagePosDelta;
						}
					}
					self.renderer.render(self.scene, self.camera);
				},
				complete:function(){
					self.slideMoving = false;
				}
			});
		}
		back(){
			if(this.slideMoving)return false;
			this.slideMoving = true;
			let self = this;
			let beforePoses = [];
			for (let i = 0; i < this.pages.length; i++) {
				beforePoses[i] = {};
				beforePoses[i].x = this.pages[i].position.x;
				beforePoses[i].y = this.pages[i].position.y;
				beforePoses[i].z = this.pages[i].position.z;
			}

			$({pagePosDelta:0, flontPagePosDelta:0}).animate({pagePosDelta:50, flontPagePosDelta:600}, {
				duration:500,
				progress:function(){
					for (let i = 0; i < self.pages.length; i++) {
						if(beforePoses[i].z > 0){
							self.pages[i].position.x = beforePoses[i].x + this.flontPagePosDelta;
							self.pages[i].position.y = beforePoses[i].y + this.flontPagePosDelta;
							self.pages[i].position.z = beforePoses[i].z - this.flontPagePosDelta;
						}else{
							self.pages[i].position.x = beforePoses[i].x + this.pagePosDelta;
							self.pages[i].position.y = beforePoses[i].y + this.pagePosDelta;
							self.pages[i].position.z = beforePoses[i].z - this.pagePosDelta;
						}
					}
					self.renderer.render(self.scene, self.camera);
				},
				complete:function(){
					self.slideMoving = false;
				}
			});
		}
	}
	class Page{
		constructor(){
			this._dom = null;
			this._pos = new THREE.Vector3();
			this._rotation = {x:0, y:0, z:0};
		}
		set dom(dom){
			this._dom = dom;
		}
		set pos(pos){
			this._pos.x = pos.x;
			this._pos.y = pos.y;
			this._pos.z = pos.z;
		}
		set rotation(rotation){
			this._rotation.x = rotation.x;
			this._rotation.y = rotation.y;
			this._rotation.z = rotation.z;
		}
		get pageData(){
			return {
				dom: this._dom,
				pos: this._pos,
				rotation: this._rotation
			};
		}
	}

	let display = new Display();
	
	$("#pages .page").each((i, dom)=>{
		let page = new Page();
		page.dom = dom;
		page.pos = {x:i * 50, y:i * 50, z:i * -50};
		display.addPage(page);
	});
	$('body').keydown(function(e){
		if(e.keyCode == 32){
			display.next();
		}else if(e.keyCode == 37){
			display.back();
		}
	});
});