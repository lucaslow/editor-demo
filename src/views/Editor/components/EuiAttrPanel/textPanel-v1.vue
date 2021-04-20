<template>
  <div class="eui-text-common-panel-v1">
    <div class="editor-panel-content">
      <div class="text-row">
        <div class="font-family_item row">
          <FontFamilyPicker
            :curComponent="curComponent"
            :fontFamilyCache="fontFamilyCache"
            @changeFontFamily="changeFontFamily"
          />
        </div>
        <div class="font-size_item row">
          <a-input-number
            id="fontSizeNum"
            v-model="curFontSize"
            :min="1"
            :max="500"
            @change="changeFontSize"
          />
        </div>
      </div>
      <div class="text-row row font-style-wrapper font-varign-wrapper">
        <div
          class="font-style-btn text-prop-btn"
          v-for="item in fontShapeArr"
          :key="item.id"
          :class="{ active: item.isActive }"
          @click="
            changeFontStyle(
              item,
              item.propName,
              item.val,
              item.isActive,
              'fontShapeArr'
            )
          "
        >
          <span v-html="item.svgActive" v-if="item.isActive"></span>
          <span v-html="item.svgNormal" v-else></span>
        </div>
      </div>
      <div class="text-row row text-align-wrapper font-style-wrapper">
        <div
          class="text-align-btn text-prop-btn"
          v-for="item in textAlignArr"
          :key="item.id"
          :class="{ active: item.isActive }"
          @click="
            changeFontStyle(
              item,
              item.propName,
              item.val,
              item.isActive,
              'textAlignArr'
            )
          "
        >
          <span v-html="item.svgActive" v-if="item.isActive"></span>
          <span v-html="item.svgNormal" v-else></span>
        </div>
      </div>
      <div class="text-row row font-style-wrapper">
        <a-popconfirm
          placement="bottom"
          ok-text="Yes"
          cancel-text="No"
          icon=" "
          class="text-letter-spacing-pop"
        >
          <template slot="title">
            <div class="text-letter-spacing-bar">
              <span class="marginR15 font-text">字间距</span>
              <a-slider
                v-model="letterSpacing"
                class="slider"
                :min="-50"
                :max="50"
                @afterChange="changeFontLetterSpacing"
              />
              <a-input-number
                v-model="letterSpacing"
                :min="-50"
                :max="50"
                @blur="changeFontLetterSpacing"
                @pressEnter="changeFontLetterSpacing"
                @change="val => numChangeLimit(val, 'letterSpacing')"
              />
            </div>
          </template>
          <div class="text-prop-btn text-letter-spacing">
            <svg
              t="1612245962650"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4578"
              width="20"
              height="20"
            >
              <path
                d="M33.450667 3.413333h102.4v956.8256H33.450667V3.413333z m887.330133 1.8432h102.4v957.713067h-102.4V5.188267z m-425.301333 200.704h108.9536l223.6416 584.977067h-102.4l-53.248-146.6368H427.485867l-53.248 146.6368h-102.4l223.6416-584.9088z m-39.3216 359.697067H643.754667L552.004267 309.248h-3.2768L456.157867 565.6576z"
                fill="#2c2c2c"
                p-id="4579"
              ></path>
            </svg>
          </div>
        </a-popconfirm>
        <a-popconfirm
          placement="bottom"
          ok-text="Yes"
          cancel-text="No"
          icon=" "
          class="text-letter-spacing-pop"
        >
          <template slot="title">
            <div class="text-letter-spacing-bar">
              <span class="marginR15 font-text">行间距</span>
              <a-slider
                v-model="lineHeight"
                class="slider"
                :min="0.5"
                :max="2.5"
                :step="0.1"
                @afterChange="changeFontLineHeight"
              />
              <a-input-number
                v-model="lineHeight"
                :min="0.5"
                :max="2.5"
                @blur="changeFontLineHeight"
                @pressEnter="changeFontLineHeight"
                @change="val => numChangeLimit(val, 'lineHeight')"
              />
            </div>
          </template>
          <div class="text-prop-btn text-line-height">
            <svg
              t="1612246008894"
              class="icon"
              viewBox="0 0 1097 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4904"
              width="20"
              height="20"
            >
              <path
                d="M37.888 155.355429v-109.714286h1024.219429v109.714286H37.888zM476.891429 445.952v-109.714286h584.265142v109.714286H476.891429z m0.877714 225.718857v-109.714286h582.656v109.714286H477.622857zM40.228571 958.025143v-109.714286h1018.587429v109.714286H40.228571z m-40.301714-514.925714l181.833143-172.690286L363.52 443.172571H-0.073143z m1.974857 148.772571h363.300572L183.588571 762.660571 1.901714 591.872z"
                fill="#333333"
                p-id="4905"
              ></path>
            </svg>
          </div>
        </a-popconfirm>
      </div>
      <div class="text-effect-panel_label">
        <p>特效</p>
        <span @click.stop="textEffectVisible = !textEffectVisible"
          >高级设置</span
        >
      </div>
      <!-- <div class="text-effect-panel-row text-effect-wrapper">

      </div> -->
      <div class="text-effect-panel-row row text-color-wrapper">
        <div class="text-color-panel_label">
          <span>颜色</span>
          <div class="text-color_more">
            <a-icon type="font-colors" />
          </div>
        </div>
        <div
          class="text-color_picker"
          @click.stop="showColorPick = !showColorPick"
        >
          <div
            class="text-color"
            :style="{ backgroundColor: curComponent.style.color }"
          ></div>
        </div>
      </div>
      <div
        class="opacity-picker"
        @click.stop
        @mouseup="recordSnapshot"
        v-if="showColorPick"
      >
        <chrome-picker
          class="colorPicker"
          v-model="color"
          @input="changeTextColor"
        />
      </div>
      <div class="text-effect-panel-row row component-opacity-wrapper">
        <div class="component-opacity-panel_label">
          <img :src="fillOpacitySrc" alt="" />
        </div>
        <a-slider
          v-model="opacity"
          class="slider"
          :min="0"
          :max="100"
          :step="1"
          @change="changeComponentOpacity"
          @afterChange="recordSnapshot('slider')"
        />
        <a-input-number
          v-model="opacity"
          :min="0"
          :max="100"
          @blur="changeComponentOpacity"
          @pressEnter="changeComponentOpacity"
          @change="val => numChangeLimit(val, 'opacity')"
        />
        <span class="component-opacity-panel_input_label">%</span>
      </div>
    </div>
    <a-drawer
      class="text-effect-drawer"
      placement="right"
      :closable="false"
      :visible="textEffectVisible"
      :get-container="false"
      :mask="false"
      :wrap-style="{ position: 'absolute' }"
    >
      <TextEffectPanelV1
        :curComponent="curComponent"
        @closeTextEffect="textEffectVisible = false"
        @changeTextEffect="changeTextEffect"
        @recordSnapshot="recordSnapshot"
        @addStroke="addStroke"
        @deleteStroke="deleteStroke"
        @addShadow="addShadow"
        @deleteShadow="deleteShadow"
      />
    </a-drawer>
    <ElementBar :curComponent="curComponent" :canvasData="canvasData" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import throttle from 'lodash.throttle'
// import textMixin from './mixin/text'
import eventBus from 'utils/eventBus'
export default {
  name: 'textPanelV1',
  // mixins: [textMixin],
  data() {
    return {
      fillOpacitySrc: require('assets/text/fill-opacity.png'),
      showColorPick: false,
      textEffectVisible: false,
      curFontSize: 0,
      fontShapeArr: [
        {
          id: '1',
          propName: 'fontWeight',
          val: 'bold',
          initVal: 'normal',
          isActive: false,
          svgNormal:
            '<svg t="1612180426381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1994" width="15" height="15"><path class="path" d="M517.292448 1023.39542a382.700393 382.700393 0 0 0 259.260286-82.213276 278.130876 278.130876 0 0 0 94.833734-221.459005A230.653912 230.653912 0 0 0 808.524563 554.274932a267.734022 267.734022 0 0 0-165.38811-79.208405v-2.884676A275.726979 275.726979 0 0 0 778.475851 386.002146a217.372381 217.372381 0 0 0 53.727097-145.916545A205.412994 205.412994 0 0 0 745.662658 64.24054 412.568813 412.568813 0 0 0 499.263221 0.837758H151.178944v1022.557662H517.292448z m-80.590645-841.36393Q631.477553 182.03149 631.477553 293.452113a108.535947 108.535947 0 0 1-48.73901 94.533248 230.834204 230.834204 0 0 1-133.416281 33.774752H331.771702V182.03149H436.761901z m20.132637 420.681965a230.954399 230.954399 0 0 1 129.089266 30.409296A97.297729 97.297729 0 0 1 631.477553 718.941872a105.290686 105.290686 0 0 1-45.734139 90.687012 214.968484 214.968484 0 0 1-126.805564 32.692999H331.711604v-239.428136h125.182934z" fill="#2c2c2c" p-id="1995"></path></svg>',
          svgActive:
            '<svg t="1612180426381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1994" width="15" height="15"><path class="path" d="M517.292448 1023.39542a382.700393 382.700393 0 0 0 259.260286-82.213276 278.130876 278.130876 0 0 0 94.833734-221.459005A230.653912 230.653912 0 0 0 808.524563 554.274932a267.734022 267.734022 0 0 0-165.38811-79.208405v-2.884676A275.726979 275.726979 0 0 0 778.475851 386.002146a217.372381 217.372381 0 0 0 53.727097-145.916545A205.412994 205.412994 0 0 0 745.662658 64.24054 412.568813 412.568813 0 0 0 499.263221 0.837758H151.178944v1022.557662H517.292448z m-80.590645-841.36393Q631.477553 182.03149 631.477553 293.452113a108.535947 108.535947 0 0 1-48.73901 94.533248 230.834204 230.834204 0 0 1-133.416281 33.774752H331.771702V182.03149H436.761901z m20.132637 420.681965a230.954399 230.954399 0 0 1 129.089266 30.409296A97.297729 97.297729 0 0 1 631.477553 718.941872a105.290686 105.290686 0 0 1-45.734139 90.687012 214.968484 214.968484 0 0 1-126.805564 32.692999H331.711604v-239.428136h125.182934z" fill="#2354f4" p-id="1995"></path></svg>'
        },
        {
          id: '2',
          propName: 'fontStyle',
          val: 'italic',
          initVal: 'normal',
          isActive: false,
          svgNormal:
            '<svg t="1612181137518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2340" width="15" height="15"><path d="M782.885107 0H411.697897l-28.349145 169.793922h81.857403L351.207684 854.085699H269.35028l-28.349144 169.914301h371.187209l28.288956-169.914301h-83.061189L671.414584 169.793922h83.121378z" fill="#2c2c2c" p-id="2341"></path></svg>',
          svgActive:
            '<svg t="1612181137518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2340" width="15" height="15"><path d="M782.885107 0H411.697897l-28.349145 169.793922h81.857403L351.207684 854.085699H269.35028l-28.349144 169.914301h371.187209l28.288956-169.914301h-83.061189L671.414584 169.793922h83.121378z" fill="#2354f4" p-id="2341"></path></svg>'
        },
        {
          id: '3',
          propName: 'textDecoration',
          val: 'underline',
          initVal: 'none',
          isActive: false,
          svgNormal:
            '<svg t="1612181197338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2969" width="15" height="15"><path d="M842.925793 0L662.304908 0.481656v481.655691c0 133.057385-44.432738 208.195673-149.072436 208.195673C406.846771 690.33302 361.270101 620.19191 361.270101 482.137347V0.481656L180.649217 0V482.137347q0 361.241769 325.418627 361.241769 337.158984 0 337.158984-370.874883V0zM60.235294 1023.21731V963.793039h903.104422v59.24365H60.235294z" fill="#2c2c2c" p-id="2970"></path></svg>',
          svgActive:
            '<svg t="1612181197338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2969" width="15" height="15"><path d="M842.925793 0L662.304908 0.481656v481.655691c0 133.057385-44.432738 208.195673-149.072436 208.195673C406.846771 690.33302 361.270101 620.19191 361.270101 482.137347V0.481656L180.649217 0V482.137347q0 361.241769 325.418627 361.241769 337.158984 0 337.158984-370.874883V0zM60.235294 1023.21731V963.793039h903.104422v59.24365H60.235294z" fill="#2354f4" p-id="2970"></path></svg>'
        },
        {
          id: '4',
          propName: 'textDecoration',
          val: 'line-through',
          initVal: 'none',
          isActive: false,
          svgNormal:
            '<svg t="1612181234870" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3487" width="30" height="30"><path d="M667.52 257.92H293.12v140.8h82.56v-58.24h104.96v343.04h-61.44v82.56h205.44v-82.56H563.2V340.48h104.32v58.24h82.56v-140.8h-82.56z" fill="#2c2c2c" p-id="3488"></path><path d="M283.52 480h456.96v64H283.52z" fill="#2c2c2c" p-id="3489"></path></svg>',
          svgActive:
            '<svg t="1612181234870" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3487" width="30" height="30"><path d="M667.52 257.92H293.12v140.8h82.56v-58.24h104.96v343.04h-61.44v82.56h205.44v-82.56H563.2V340.48h104.32v58.24h82.56v-140.8h-82.56z" fill="#2354f4" p-id="3488"></path><path d="M283.52 480h456.96v64H283.52z" fill="#2354f4" p-id="3489"></path></svg>'
        }
      ],
      textAlignArr: [
        {
          id: 1,
          propName: 'textAlign',
          val: 'left',
          isActive: false,
          svgNormal:
            '<svg t="1612232994048" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2057" width="20" height="20"><path d="M960.007451 0H64.00158C28.652059 0 0 28.653866 0 64.003387s28.652059 64.00158 64.00158 64.00158h896.005871c35.338684 0 63.992549-28.652059 63.992549-64.00158C1024 28.653866 995.346134 0 960.007451 0zM704.001129 896.007676H64.00158C28.652059 896.007676 0 924.659736 0 960.009257c0 35.338684 28.652059 63.990743 64.00158 63.990743h639.999549c35.347715 0 64.00158-28.652059 64.00158-63.990743 0-35.349521-28.653866-64.00158-64.00158-64.001581zM704.001129 296.962348H64.00158C28.652059 296.962348 0 325.614407 0 360.963929c0 35.349521 28.652059 64.00158 64.00158 64.00158h639.999549c35.347715 0 64.00158-28.652059 64.00158-64.00158 0-35.349521-28.653866-64.00158-64.00158-64.001581zM960.007451 599.045328H64.00158C28.652059 599.045328 0 627.699194 0 663.046909c0 35.338684 28.652059 63.990743 64.00158 63.990743h896.005871c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.347715-28.653866-64.00158-63.992549-64.001581z" fill="#2c2c2c" p-id="2058"></path></svg>',
          svgActive:
            '<svg t="1612232994048" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2057" width="20" height="20"><path d="M960.007451 0H64.00158C28.652059 0 0 28.653866 0 64.003387s28.652059 64.00158 64.00158 64.00158h896.005871c35.338684 0 63.992549-28.652059 63.992549-64.00158C1024 28.653866 995.346134 0 960.007451 0zM704.001129 896.007676H64.00158C28.652059 896.007676 0 924.659736 0 960.009257c0 35.338684 28.652059 63.990743 64.00158 63.990743h639.999549c35.347715 0 64.00158-28.652059 64.00158-63.990743 0-35.349521-28.653866-64.00158-64.00158-64.001581zM704.001129 296.962348H64.00158C28.652059 296.962348 0 325.614407 0 360.963929c0 35.349521 28.652059 64.00158 64.00158 64.00158h639.999549c35.347715 0 64.00158-28.652059 64.00158-64.00158 0-35.349521-28.653866-64.00158-64.00158-64.001581zM960.007451 599.045328H64.00158C28.652059 599.045328 0 627.699194 0 663.046909c0 35.338684 28.652059 63.990743 64.00158 63.990743h896.005871c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.347715-28.653866-64.00158-63.992549-64.001581z" fill="#2354f4" p-id="2058"></path></svg>'
        },
        {
          id: 2,
          propName: 'textAlign',
          val: 'center',
          isActive: false,
          svgNormal:
            '<svg t="1612241220455" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2724" width="20" height="20"><path d="M36.059429 147.382857v-109.714286H1060.571429v109.714286H36.059429z m219.794285 282.916572v-109.714286h582.144v109.714286H255.853714zM38.985143 718.262857v-109.714286h1022.464v109.714286H38.985143z m220.306286 278.674286v-109.714286h579.657142v109.714286H259.291429z" fill="#2c2c2c" p-id="2725"></path></svg>',
          svgActive:
            '<svg t="1612241220455" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2724" width="20" height="20"><path d="M36.059429 147.382857v-109.714286H1060.571429v109.714286H36.059429z m219.794285 282.916572v-109.714286h582.144v109.714286H255.853714zM38.985143 718.262857v-109.714286h1022.464v109.714286H38.985143z m220.306286 278.674286v-109.714286h579.657142v109.714286H259.291429z" fill="#2354f4" p-id="2725"></path></svg>'
        },
        {
          id: 3,
          propName: 'textAlign',
          val: 'right',
          isActive: false,
          svgNormal:
            '<svg t="1612241307597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3555" width="20" height="20"><path d="M960.007451 0H64.00158C28.652059 0 0 28.653866 0 64.003387s28.652059 64.00158 64.00158 64.00158h896.005871c35.338684 0 63.992549-28.652059 63.992549-64.00158C1024 28.653866 995.346134 0 960.007451 0zM960.007451 896.007676H319.998871c-35.338684 0-63.990743 28.652059-63.990743 64.001581 0 35.338684 28.652059 63.990743 63.990743 63.990743h640.00858c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.349521-28.653866-64.00158-63.992549-64.001581zM960.007451 296.962348H319.998871c-35.338684 0-63.990743 28.653866-63.990743 64.001581 0 35.349521 28.652059 64.00158 63.990743 64.00158h640.00858c35.338684 0 63.992549-28.652059 63.992549-64.00158 0-35.349521-28.653866-64.00158-63.992549-64.001581zM960.007451 599.045328H64.00158C28.652059 599.045328 0 627.699194 0 663.046909c0 35.338684 28.652059 63.990743 64.00158 63.990743h896.005871c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.347715-28.653866-64.00158-63.992549-64.001581z" fill="#2c2c2c" p-id="3556"></path></svg>',
          svgActive:
            '<svg t="1612241307597" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3555" width="20" height="20"><path d="M960.007451 0H64.00158C28.652059 0 0 28.653866 0 64.003387s28.652059 64.00158 64.00158 64.00158h896.005871c35.338684 0 63.992549-28.652059 63.992549-64.00158C1024 28.653866 995.346134 0 960.007451 0zM960.007451 896.007676H319.998871c-35.338684 0-63.990743 28.652059-63.990743 64.001581 0 35.338684 28.652059 63.990743 63.990743 63.990743h640.00858c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.349521-28.653866-64.00158-63.992549-64.001581zM960.007451 296.962348H319.998871c-35.338684 0-63.990743 28.653866-63.990743 64.001581 0 35.349521 28.652059 64.00158 63.990743 64.00158h640.00858c35.338684 0 63.992549-28.652059 63.992549-64.00158 0-35.349521-28.653866-64.00158-63.992549-64.001581zM960.007451 599.045328H64.00158C28.652059 599.045328 0 627.699194 0 663.046909c0 35.338684 28.652059 63.990743 64.00158 63.990743h896.005871c35.338684 0 63.992549-28.652059 63.992549-63.990743 0-35.347715-28.653866-64.00158-63.992549-64.001581z" fill="#2354f4" p-id="3556"></path></svg>'
        },
        {
          id: 4,
          propName: 'textAlign',
          val: 'justify',
          isActive: false,
          svgNormal:
            '<svg t="1612241351572" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3939" width="20" height="20"><path d="M40.667429 151.844571v-109.714285h1018.733714v109.714285H40.667429zM35.108571 438.564571v-109.714285h1026.56v109.714285H35.108571zM36.425143 721.188571v-109.714285h1022.244571v109.714285H36.425143z m4.096 276.845715v-109.714286h1015.808v109.714286H40.521143z" fill="#2c2c2c" p-id="3940"></path></svg>',
          svgActive:
            '<svg t="1612241351572" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3939" width="20" height="20"><path d="M40.667429 151.844571v-109.714285h1018.733714v109.714285H40.667429zM35.108571 438.564571v-109.714285h1026.56v109.714285H35.108571zM36.425143 721.188571v-109.714285h1022.244571v109.714285H36.425143z m4.096 276.845715v-109.714286h1015.808v109.714286H40.521143z" fill="#2354f4" p-id="3940"></path></svg>'
        }
      ],
      letterSpacing: 0,
      lineHeight: 0,
      color: '#000000',
      opacity: 100
    }
  },
  components: {
    FontFamilyPicker: () =>
      import(
        /* webpackChunkName: "FontFamilyPicker" */ 'components/Editor/FontFamilyPicker/FontFamilyPicker.vue'
      ),
    'chrome-picker': () =>
      import(
        /* webpackChunkName: "ColorPicker" */ 'components/Editor/ColorPicker/components/Chrome.vue'
      ),
    ElementBar: () =>
      import(
        /* webpackChunkName: "ElementBar" */ 'components/Editor/ElementBar/ElementBar.vue'
      ),
    TextEffectPanelV1: () =>
      import(
        /* webpackChunkName: "TextEffectPanel" */ 'views/Editor/components/EuiAttrPanel/textEffectPanel-v1.vue'
      )
  },
  props: {
    curComponent: {
      type: Object,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    }
  },
  mounted() {
    const that = this
    eventBus.$on('hideColorPicker', function() {
      that.showColorPick = false
    })
  },
  computed: {
    ...mapState({
      fontFamilyCache: state => state.Canvas.fontFamilyCache
    }),
    curComponentFontSize() {
      return this.curComponent.style.fontSize
    }
  },
  watch: {
    curComponentFontSize(val) {
      this.curFontSize = val
    },
    curComponent() {
      this.initPropFunc()
    }
  },
  created() {
    this.initPropFunc()
  },
  methods: {
    initPropFunc() {
      /* 需要初始化的数据方法 */
      /* 初始化组件文字大小  */
      this.curFontSize = this.curComponent.style.fontSize
      this.color = this.curComponent.style.color
      this.opacity = this.curComponent.style.opacity * 100 || 100
      /* 初始化文字的fonotStyle */
      this.setFontShapeArr()
      this.setFontTextAlignArr()
      this.setFontSpacing()
    },
    throttle: throttle(
      /* 所有的数据更新都要节流 */
      (fn, data) => {
        fn(data)
      },
      1000,
      {
        leading: false,
        trailing: true
      }
    ),
    numChangeLimit(val, key) {
      if (typeof val != 'number') {
        this[key] = 0
      }
    },
    recordSnapshot(type = 'color') {
      /* 只有鼠标松开的时候才记录数据 */
      this.$emit('recordSnapshot', type)
    },
    setFontShapeArr() {
      this.fontShapeArr.forEach(item => {
        if (this.curComponent.style[item.propName] === item.val) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
    },
    setFontTextAlignArr() {
      this.textAlignArr.forEach(item => {
        if (this.curComponent.style[item.propName] === item.val) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
    },
    setFontSpacing() {
      if (this.curComponent.style.letterSpacing !== undefined) {
        this.letterSpacing = this.curComponent.style.letterSpacing
      } else {
        this.letterSpacing = 0
      }
      if (this.curComponent.style.lineHeight !== undefined) {
        this.lineHeight = this.curComponent.style.lineHeight
      } else {
        this.lineHeight = 0
      }
    },
    changeFontSize(val) {
      this.$emit('changeFontSize', val)
    },
    changeFontStyle(item, propName, val, active, dataName) {
      const style = {}
      if (active) {
        if (dataName === 'textAlignArr') return
        style[propName] = item.initVal
        this.$emit('changeFontStyle', style)
      } else {
        style[propName] = val
        this.clearOtherSameProp(item, propName, dataName)
        this.$emit('changeFontStyle', style)
      }
      item.isActive = !item.isActive
    },
    clearOtherSameProp(propObj, propName, dataName) {
      /* 清除相同属性的其他赋值 */
      this[dataName].forEach(item => {
        if (item !== propObj && item.propName === propName) {
          item.isActive = false
        }
      })
    },
    changeFontLetterSpacing() {
      this.$emit('changeFontStyle', {
        letterSpacing: this.letterSpacing
      })
    },
    changeFontLineHeight() {
      this.$emit('changeFontStyle', {
        lineHeight: this.lineHeight
      })
    },
    changeFontFamily(val) {
      this.$emit('changeFontStyle', {
        fontFamily: val
      })
    },
    changeTextColor(val) {
      const rgbaObj = val.rgba
      const rgba =
        'rgba(' + [rgbaObj.r, rgbaObj.g, rgbaObj.b, rgbaObj.a].join(',') + ')'
      this.$emit('changeFontStyle', {
        color: rgba
      })
    },
    changeComponentOpacity(val) {
      this.$emit('changeFontStyle', {
        opacity: val / 100
      })
    },
    changeTextEffect(type, index, style) {
      this.$emit('changeTextEffect', type, index, style)
    },
    addStroke() {
      this.$store.dispatch('Canvas/ComponentEffect/addTextEffect', 'stroke')
      this.$store.commit('Canvas/recordSnapshot')
    },
    addShadow() {
      this.$store.dispatch('Canvas/ComponentEffect/addTextEffect', 'shadow')
      this.$store.commit('Canvas/recordSnapshot')
    },
    deleteStroke(index) {
      this.$store.dispatch('Canvas/ComponentEffect/deleteTextEffect', {
        type: 'stroke',
        index
      })
      this.$store.commit('Canvas/recordSnapshot')
    },
    deleteShadow(index) {
      this.$store.dispatch('Canvas/ComponentEffect/deleteTextEffect', {
        type: 'shadow',
        index
      })
      this.$store.commit('Canvas/recordSnapshot')
    }
  }
}
</script>

<style lang="scss" scoped>
.eui-text-common-panel-v1 {
  height: 100%;
  width: 100%;
  padding: 16px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
.row {
  border-radius: 4px;
  height: 40px;
  background: #f6f7f9;
  @include userSelectNone;
}
.text-row {
  width: 100%;
  height: 40px;
  margin-bottom: 12px;
  border-radius: 4px;
  @include flexWrapper(space-between, center);
}
.margin20 {
  margin-top: 20px;
}
.marginR15 {
  margin-right: 16px;
}
.font-family_item {
  width: 70%;
}
.slider {
  width: 110px;
}
.ant-input-number {
  width: 40px;
}
.font-size_item {
  width: 25%;
  .ant-input-number {
    width: 100%;
    height: 100%;
    border: none !important;
    box-shadow: none;
    background: transparent;
    font-size: 15px;
    line-height: 20px;
  }
  .ant-input-number-input-wrap {
    height: 100%;
  }
}

.font-style-wrapper {
  @include flexWrapper(flex-start, center);
  .text-prop-btn {
    width: 20%;
    height: 40px;
    z-index: 1;
    display: block;
    border-radius: 4px;
    transition: all 0.2s ease;
    padding: 0 6px;
    box-sizing: content-box;
    span {
      @include flexWrapper(center, center);
    }
    @include flexWrapper(center, center);
    cursor: pointer;
    &:hover {
      background: #bebebf;
    }
  }
}
.text-letter-spacing-bar {
  width: 100%;
  @include flexWrapper(flex-start, center);
  .font-text {
    white-space: nowrap;
  }
}
.text-effect-panel-row {
  height: 80px;
  border: 1px solid #ecedef;
  border-radius: 4px;
  margin-bottom: 12px;
}
.text-color-wrapper {
  background-color: #fff;
  padding: 10px;
  .text-color-panel_label {
    font-size: 14px;
    @include flexWrapper(space-between, center);
    .text-color_more {
      cursor: pointer;
    }
  }
  .text-color_picker {
    margin-top: 10px;
    position: relative;
  }
  .text-color {
    width: 100%;
    height: 25px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ecedef;
    margin: 0 auto;
  }
}
.component-opacity-wrapper {
  background: #ffffff;
  padding: 10px;
  font-size: 12px;
  height: 50px;
  @include flexWrapper(space-between, center);
  .component-opacity-panel_label {
    width: 20px;
    height: 20px;
    img {
      max-width: 100%;
    }
  }
  .slider {
    width: 120px;
  }
  .ant-input-number {
    width: 30px;
  }
  .component-opacity-panel_input_label {
    width: 20px;
    margin-left: -7px;
  }
}
.opacity-picker {
  position: absolute;
  z-index: 1;
}
.text-effect-panel_label {
  margin-bottom: 12px;
  text-align: left;
  font-size: 13px;
  @include flexWrapper(space-between, center);
  p {
    opacity: 0;
    margin: 0;
  }
  span {
    cursor: pointer;
    opacity: 1;
  }
}
</style>
<style lang="scss">
.eui-text-common-panel-v1 {
  .ant-input-number-handler-wrap {
    background: transparent;
    opacity: 1;
  }
  .ant-input-number-input-wrap {
    height: 100%;
    input {
      height: 100%;
      padding: 0 5px;
    }
  }
  .ant-slider-track {
    background-color: #3152e2 !important;
  }
  .ant-slider-handle {
    border: solid 2px #3152e2 !important;
  }
}
.text-letter-spacing-bar,
.component-opacity-wrapper {
  .ant-input-number {
    box-shadow: none;
    &:hover,
    &:active,
    &:focus {
      border: 1px solid #e3dede;
    }
    border: none;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
  input {
    text-align: center;
    padding: 0;
  }
}
.component-opacity-wrapper {
  input {
    text-align: right;
    padding: 0 !important;
  }
}
.ant-popover-placement-bottom {
  width: 250px;
}
.ant-popover-buttons {
  display: none;
}
.ant-popover-message-title {
  padding: 0;
}
.text-effect-drawer {
  .ant-drawer-content-wrapper {
    width: 276px !important;
  }
  .ant-drawer-body {
    padding: 0;
  }
}
</style>
