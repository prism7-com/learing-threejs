precision highp float;
uniform float time;
uniform float alpha;
uniform vec2 resolution;
varying vec2 vUv;

void main2(void)
{
    vec2 position=vUv;
    float red=1.;
    float green=.25+sin(time)*.25;
    float blue=0.;
    vec3 rgb=vec3(red,green,blue);
    vec4 color=vec4(rgb,alpha);
    gl_FragColor=color;
}

#define PI 3.14159
#define TWO_PI(PI*2.)
#define N 68.5

void main(void)
{
    vec2 center=(gl_FragCoord.xy);
    center.x=-10.12*sin(time/200.);
    center.y=-10.12*cos(time/200.);
    
    vec2 v=(gl_FragCoord.xy-resolution/20.)/min(resolution.y,resolution.x)*15.;
    v.x=v.x-10.;
    v.y=v.y-200.;
    float col=0.;
    
    for(float i=0.;i<N;i++)
    {
        float a=i*(TWO_PI/N)*61.95;
        col+=cos(TWO_PI*(v.y*cos(a)+v.x*sin(a)+sin(time*.004)*100.));
    }
    
    col/=5.;
    
    gl_FragColor=vec4(col*1.,-col*1.,-col*4.,1.);
}