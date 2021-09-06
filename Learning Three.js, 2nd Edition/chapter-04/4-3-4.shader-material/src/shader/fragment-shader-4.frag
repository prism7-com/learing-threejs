uniform float time;
uniform vec2 resolution;

vec2 rand(vec2 pos)
{
    return
    fract(
        (
            pow(
                pos+2.,
                pos.yx+2.
            )*555555.
        )
    );
}

vec2 rand2(vec2 pos)
{
    return rand(rand(pos));
}

float softnoise(vec2 pos,float scale){
    vec2 smplpos=pos*scale;
    float c0=rand2((floor(smplpos)+vec2(0.,0.))/scale).x;
    float c1=rand2((floor(smplpos)+vec2(1.,0.))/scale).x;
    float c2=rand2((floor(smplpos)+vec2(0.,1.))/scale).x;
    float c3=rand2((floor(smplpos)+vec2(1.,1.))/scale).x;
    
    vec2 a=fract(smplpos);
    return mix(mix(c0,c1,smoothstep(0.,1.,a.x)),
    mix(c2,c3,smoothstep(0.,1.,a.x)),
    smoothstep(0.,1.,a.x));
}

void main(void){
    vec2 pos=gl_FragCoord.xy/resolution.y-time*.4;
    
    float color=0.;
    float s=1.;
    for(int i=0;i<6;++i){
        color+=softnoise(pos+vec2(.01*float(i)),s*4.)/s/2.;
        s*=2.;
    }
    gl_FragColor=vec4(color,mix(color,cos(color),sin(color)),color,1);
}