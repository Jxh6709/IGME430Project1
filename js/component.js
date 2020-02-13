// https://codepen.io/umeshagouda/pen/QggMve
Vue.component("modal",{
	methods: {
		updateRecord: function(key, value) {
			this.$emit('input', {
				...this.value, [key]: value 
			})
		}
	},
	props:['name','people','value','titles'],
	template:`
		<div class="modal fade in modal-active">
			<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">
								{{name}}
							</h4>
						</div>
						<div class="modal-body">
								<form>
									<label for="exampleFormControlInput1">Choose The List To Add To</label>
									<select @input="updateRecord('listType',$event.target.value)">
										<option v-for="title in titles">{{title.title}}</option>
									</select>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1">Name</label>
										<input type="text" class="form-control" placeholder="Your Name Here" 
										:value="value.name" @input="updateRecord('name', $event.target.value)"> 
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleFormControlInput1">Email address</label>
										<input type="email" class="form-control"  placeholder="name@example.com" 
										  	:value="value.email" ref = "emailField"  @input="updateRecord('email',$event.target.value)">
                                    </div>
                                </form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="$emit('close')">Close</button>
							<button type="button" class="btn btn-primary" @click="$emit('savechanges')">Save changes</button>
						</div>
				</div>
			</div>
		</div>`
})