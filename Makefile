# ------------- 基础设置 ------------
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: 127.0.0.1:9090

# ----------- 1. 节点列表 (Proxies) -------------
proxies:
  - name: "111"
    type: vless
    server: 20.151.19.141
    port: 13477
    uuid: d3248509-dcaf-458c-bb76-60ab4c2db9d5
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    client-fingerprint: chrome
    servername: learn.microsoft.com
    reality-opts:
      public-key: w9DsyKUMi6QMRQQ0UJvW1nz3EEjAMXAL1Ydbl6DW-h8
      short-id: 9895a5e7

# ----------- 2. 策略组 (Proxy Groups) -------------
proxy-groups:
  - name: Proxy
    type: select
    proxies:
      - 111

# ----------- 3. 规则 (Rules) -------------
rules:
  # === 1. AI 服务强制走代理 ===
  - DOMAIN-SUFFIX,perplexity.ai,Proxy
  - DOMAIN-SUFFIX,pplx.ai,Proxy
  - DOMAIN-KEYWORD,perplexity,Proxy

  # OpenAI / ChatGPT / Claude 等 AI 域名
  - DOMAIN-SUFFIX,openai.com,Proxy
  - DOMAIN-SUFFIX,chatgpt.com,Proxy
  - DOMAIN-SUFFIX,anthropic.com,Proxy
  - DOMAIN-SUFFIX,claude.ai,Proxy

  # === 2. 微软国内服务直连 ===
  - DOMAIN-SUFFIX,qq.cn,DIRECT
  - DOMAIN-SUFFIX,azure.cn,DIRECT
  - DOMAIN-SUFFIX,cn.bing.com,DIRECT
  # 微软主域名走直连（可注释掉以让 AI 用此节点访问 Microsoft 服务）
  - DOMAIN-SUFFIX,microsoft.com,DIRECT



  # === 4. 兜底规则：其余流量走 Proxy 组 ===
  - MATCH,Proxy

