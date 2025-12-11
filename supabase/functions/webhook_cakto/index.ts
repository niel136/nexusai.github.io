// Declare Deno to fix TypeScript errors in non-Deno environments
declare const Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // 1. Aceitar apenas POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // 2. Ler o corpo da requisição (JSON da Cakto)
    const payload = await req.json()
    console.log('Webhook Cakto Recebido:', payload)

    // Estrutura comum da Cakto (ajuste se necessário conforme logs reais)
    // Geralmente: status ou current_status, e customer.email
    const status = payload.current_status || payload.status || ''
    const email = payload.customer?.email || payload.payer_email || payload.email

    if (!email) {
      console.error('Email não encontrado no payload')
      return new Response(JSON.stringify({ message: 'Email not provided' }), { status: 200 })
    }

    // 3. Identificar Status
    let isPro = false
    const approvedStatuses = ['paid', 'approved', 'authorized', 'completed']
    const canceledStatuses = ['canceled', 'refunded', 'chargedback', 'expired', 'refused']

    if (approvedStatuses.includes(status)) {
      isPro = true
    } else if (canceledStatuses.includes(status)) {
      isPro = false
    } else {
      // Status intermediário (pending, processing), não altera nada
      return new Response(JSON.stringify({ message: 'Status ignored' }), { status: 200 })
    }

    // 4. Conectar ao Supabase com Chave de Serviço (Service Role) para poder editar usuários
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Buscar o ID do usuário pelo email
    // Nota: Em produção com milhares de usuários, recomenda-se ter uma tabela 'profiles' indexada por email.
    // Aqui usamos o método admin.listUsers para encontrar o Auth User diretamente.
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) throw listError

    const user = users.find(u => u.email === email)

    if (user) {
      // Atualizar metadados do usuário
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { 
          user_metadata: { 
            plan: isPro ? 'pro' : 'free',
            credits: isPro ? 100 : 5 // Reseta ou aumenta créditos
          } 
        }
      )

      if (updateError) throw updateError
      console.log(`Usuário ${email} atualizado. PRO: ${isPro}`)
    } else {
      console.log(`Usuário ${email} não encontrado no sistema.`)
    }

    // 6. Retornar 200 OK para a Cakto não reenviar
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    console.error('Erro no processamento:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400, // Retorna erro 400 apenas se o JSON for inválido
    })
  }
})