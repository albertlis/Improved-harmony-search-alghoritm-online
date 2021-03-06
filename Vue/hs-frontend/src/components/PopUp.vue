<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="800px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          light
          v-bind="attrs"
          v-on="on"
          x-large
          min-width="150"
        >
          Start
        </v-btn>
      </template>
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1">
          Set parameters
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card @keyup.enter="goNext()">
            <v-card-text>
              <v-form ref="form">
                <v-row>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">   
                      <v-text-field label="Function" 
                        v-model="func" 
                        v-on="on"
                        prepend-icon="functions" 
                        :error-messages="funcErrors"
                        @change="$v.func.$touch()"
                        @blur="$v.func.$touch()"> 
                      </v-text-field>
                    </template>
                    <span>Use Python notation. Mostly used: <br/>
                      - pow(x,y) -> x<sup>y</sup><br/>
                      - exp(x) -> e<sup>x</sup><br/>
                      - log(x[, y]) -> one argument = ln(x), two arguments = log<sub>y</sub>(x)<br/>
                      - sqrt(x) -> sqare root of x<br/>
                      - cos(x)<br/>
                      - sin(x)<br/>
                      For more see Python math documentation.
                    </span>
                  </v-tooltip>
                   <v-tooltip bottom>
                    <template v-slot:activator="{ on }">  
                      <v-btn 
                        v-on="on" 
                        icon 
                        color="primary"
                        href="https://docs.python.org/3/library/math.html"
                        target="_blank">
                          <v-icon>help</v-icon>
                      </v-btn>
                    </template>
                    <span>Go to Python math docs</span>
                  </v-tooltip>
                </v-row>
                <v-row>
                <v-text-field 
                  v-model="numberOfIterations"
                  type="number"
                  label="Interations"
                  :error-messages="iterationsErrors"
                  @change="$v.numberOfIterations.$touch()"
                  @blur="$v.numberOfIterations.$touch()">
                </v-text-field>
                </v-row>
                <v-row>
                <v-text-field 
                  v-model="HMS"
                  type="number"
                  label="HMS"
                  :error-messages="HMSErrors"
                  @change="$v.HMS.$touch()"
                  @blur="$v.HMS.$touch()">
                </v-text-field>
                </v-row>
                <v-row class="mt-7">
                  <v-range-slider
                    v-model="HCMRRange"
                    thumb-label="always"
                    min=0
                    max=1
                    step=0.01
                    thumb-size=28
                    label="HCMR">
                  </v-range-slider>
                </v-row>
                <v-row>
                  <v-range-slider
                    v-model="PARRange"
                    thumb-label="always"
                    min=0
                    max=1
                    step=0.01
                    thumb-size=28
                    label="PAR">
                  </v-range-slider>
                </v-row>
                <v-row>
                  <v-text-field 
                    v-model="bwMinValue"
                    type="number"
                    label="Bw min"
                    :error-messages="bwMinErrors"
                    @change="$v.bwMinValue.$touch()"
                    @blur="$v.bwMinValue.$touch()">
                  </v-text-field>
                  <v-spacer></v-spacer>
                  <v-text-field 
                    v-model="bwMaxValue"
                    type="number"
                    label="Bw max"
                    :error-messages="bwMaxErrors"
                    @change="$v.bwMaxValue.$touch()"
                    @blur="$v.bwMaxValue.$touch()">
                  </v-text-field>
                </v-row>
                <v-row fluid>
                  <v-alert :value="alert" type="error">
                    {{ alertMessage }}
                  </v-alert>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <v-row>
            <v-btn color="primary" class="ma-3" :loading="nextButtonLoading" @click="goNext()">Continue</v-btn>
            <v-btn text class="ma-3" @click="clearForm">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn text class="ma-3" @click="dialog = false">Cancel</v-btn>
          </v-row>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">Set variables range</v-stepper-step>

        <v-stepper-content step="2">
          <v-card @keyup.enter="calculate()">
            <v-card-text>
              <v-form ref="varieblesForm">
                <v-row>
                  <p> {{ this.message }} </p>
                </v-row>
                <v-row v-for="(variable,i) in variables" :key="i">
                  <v-text-field 
                    :label="variable + ' min'"
                    v-model="variablesBandwidth[i][0]"
                    type="number"> 
                  </v-text-field>
                  <v-spacer></v-spacer>
                  <v-text-field 
                    :label="variable + ' max'" 
                    v-model="variablesBandwidth[i][1]"
                    type="number"> 
                  </v-text-field>
                </v-row>
                <v-row v-if="errors.length">
                  <p class="error--text">
                    <b>Please correct the following error(s):</b>
                    <ul>
                      <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                  </p>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <v-row>
            <v-btn color="primary" class="ma-3" :loading="calculateButtonLoading" @click="calculate()">Calculate</v-btn>
            <v-btn text class="ma-3" @click="step = 1">Previous</v-btn>
            <v-spacer></v-spacer>
            <v-btn text class="ma-3" @click="dialog = false">Cancel</v-btn>
          </v-row>
        </v-stepper-content>
      </v-stepper>
    </v-dialog>
  </div>
</template>

<script>
import { required, minValue, maxValue, integer } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      func: '4*pow(x1, 2) - 2.1*pow(x1, 4) + 1/3*pow(x1, 6) + x1*x2 -4*pow(x2, 2) + 4*pow(x2, 4)',
      dialog: false,
      valid: true,
      numberOfIterations: 50000,
      HMS: 10,
      HCMRRange: [0.5, 0.75],
      PARRange: [0.2, 0.8],
      bwMinValue: 0.1,
      bwMaxValue: 2.0,
      nextButtonLoading: false,
      calculateButtonLoading: false,
      step: 1,
      message: '', 
      variables: null,
      variablesBandwidth: null,
      errors: '',
      alert: false,
      alertMessage: null
    }
  },
  methods: {
    clearForm: function () {
      this.$refs.form.reset();
      this.HCMRRange = [0.5, 0.75];
      this.PARRange = [0.5, 0.75];
    },
    goNext: async function () {
      this.$v.$touch()
      if (!this.$v.$invalid && this.isBandwidthOk()) {
        this.nextButtonLoading = true;
        const query = this.prepareCheckFunctionQuery();
        const {message, variables} = await this.sendGetRequest(query);
        if (variables === undefined) {
          this.alert = true;
          this.alertMessage = message;
          this.nextButtonLoading = false;
          return;
        }
        this.alert = false;
        this.message = message;
        this.variables = variables;
        // await this.sleep(3000);
        this.nextButtonLoading = false;
        this.step = 2;
      }
    },
    calculate: async function () {
      this.errors = this.checkForm();
      if (!this.errors.length) { 
        this.calculateButtonLoading = true;
        const query = this.prepareCalculateFunctionQuery();
        const response = await this.sendGetRequest(query);
        this.step = 1;
        this.$store.commit('setFunctionInformations', response);
        this.$store.commit('setVariablesBandwidth', this.variablesBandwidth);
        // await this.sleep(3000);
        this.$router.push("/result")
        this.calculateButtonLoading = false;
        this.dialog = false;
        this.step = 3;
      }
    },
    // sleep(ms) {
      // return new Promise(resolve => setTimeout(resolve, ms));
    // },
    prepareCheckFunctionQuery() {
      // const url = 'http://100.25.29.178/checkfunction';
      const url = 'http://127.0.0.1:5000/checkfunction';
      const func = this.func.replace(/\s+/g, '');
      const query = `${url}?function=${func}`;
      // console.log(query);
      return query;
    },
    prepareCalculateFunctionQuery() {
      // const url = 'http://100.25.29.178/calculate?';
      const url = 'http://127.0.0.1:5000/calculate?';
      const func = this.func.replace(/\s+/g, '');
      let query = url + `function=${func}&iterations=${this.numberOfIterations}&hms=${this.HMS}`+
                        `&hcmrmin=${this.HCMRRange[0]}&hcmrmax=${this.HCMRRange[1]}`+
                        `&parmin=${this.PARRange[0]}&parmax=${this.PARRange[1]}`+
                        `&bwmin=${this.bwMinValue}&bwmax=${this.bwMaxValue}`;
      for(let i = 0; i < this.variablesBandwidth.length; ++i) {
        query += `&${this.variables[i]}min=${parseFloat(this.variablesBandwidth[i][0])}`;
        query += `&${this.variables[i]}max=${parseFloat(this.variablesBandwidth[i][1])}`;
      }
      return query;
    },
    sendGetRequest (query) {
      return fetch(query, {mode: 'cors'}).then(response => {
        if(response.ok || response.status == 400) {
          return response.json();
        }
        throw new Error('Request failed');
      }).catch((error) => {
        return {message: error, variables: undefined};
      });
    },
    checkForm() {
      let errors = [];
      for (let i = 0; i < this.variablesBandwidth.length; ++i) {
        const row = this.variablesBandwidth[i];
        if (parseFloat(row[0]) >= parseFloat(row[1])) {
          errors.push('Min should be less than max value');
        }
        if (!row[0] || !row[1]) {
          errors.push('All fields are required');
        }
      }
      return [...new Set(errors)];
    },
    isBandwidthOk() {
      return !(this.bwMaxErrors.length || this.bwMaxErrors.length)
    }
  },
  validations: {
    func: {required},
    numberOfIterations : {
      required,
      integer,
      minValue: minValue(1),
      maxValue: maxValue(10000000),
    },
    HMS: {
      required,
      integer,
      minValue: minValue(1),
      maxValue: maxValue(10000000),
    },
    bwMinValue: {
      required,
      minValue: minValue(0),
    },
    bwMaxValue: {
      required,
      minValue: minValue(0),
    }
  },
  computed: { 
    funcErrors () {
      const errors = []
      if (!this.$v.func.$dirty) return errors
      !this.$v.func.required && errors.push('Function is required.')
      return errors
    },
    iterationsErrors () {
      const errors = []
      if (!this.$v.numberOfIterations.$dirty) return errors
      !this.$v.numberOfIterations.required && errors.push('Iterations are required.')
      !this.$v.numberOfIterations.integer && errors.push('Iterations have to be integer value')
      !this.$v.numberOfIterations.minValue && errors.push('Iterations have to be more than 0')
      !this.$v.numberOfIterations.maxValue && errors.push('Iterations is limited to 10000000')
      return errors
    },
    HMSErrors () {
      const errors = []
      if (!this.$v.HMS.$dirty) return errors
      !this.$v.HMS.required && errors.push('HMS is required.')
      !this.$v.HMS.integer && errors.push('HMS have to be integer value')
      !this.$v.HMS.minValue && errors.push('HMS have to be more than 0')
      !this.$v.HMS.maxValue && errors.push('Iterations is limited to 10000000')
      return errors
    },
    bwMinErrors () {
      const errors = []
      if (!this.$v.bwMinValue.$dirty) return errors
      !this.$v.bwMinValue.required && errors.push('Bw min  is required.')
      !this.$v.bwMinValue.minValue && errors.push('Bw min  have to be more than 0')
      if(this.bwMinValue >= this.bwMaxValue) {
        errors.push('Bw min have to be less than Bw max')
      }
      return errors
    },
    bwMaxErrors () {
      const errors = []
      if (!this.$v.bwMaxValue.$dirty) return errors
        !this.$v.bwMaxValue.required && errors.push('bwMax is required.')
        !this.$v.bwMaxValue.minValue && errors.push('bwMax have to be more than 0')
        if(this.bwMinValue >= this.bwMaxValue) {
          this.$v.bwMaxValue.$touch
          errors.push('Bw max have to be more than Bw min')
        }
        return errors
    }
  },
  watch: {
    variables: function (variables) {
      const variablesBandwidth = Array(variables.length);

      for (var i = 0; i < variables.length; ++i) {
        variablesBandwidth[i] = Array(2);  
      }
      this.variablesBandwidth = variablesBandwidth;
    }
  }
}
</script>